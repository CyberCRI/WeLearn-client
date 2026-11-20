import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type VueWrapper, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import ConnectionCard from '@/components/tutor/ConnectionCard.vue';
import ResourceList from '@/components/tutor/ResourceList.vue';
import { type Connection, useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import type { ConnectionEvidence, Document, EvidencedResource } from '@/types';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));
const bookmarks = vi.hoisted(() => ({ toggleBookmark: vi.fn(), isBookmarked: () => false }));
vi.mock('@/stores/bookmarks', () => ({ useBookmarksStore: () => bookmarks }));

const resource: EvidencedResource = {
  document: {
    score: 0.9,
    payload: {
      document_id: 'a',
      document_title: 'Beyond GDP',
      document_url: 'https://example.org/a',
      document_corpus: 'conversation',
      document_details: { journal: 'The Conversation' }
    }
  } as unknown as Document,
  usefulness: 'Shows what GDP misses.',
  evidence: 'GDP misses nature.'
};

const evidence = (
  status: ConnectionEvidence['status'],
  resources: EvidencedResource[] = []
): ConnectionEvidence => ({
  status,
  concept: null,
  why: 'Judged: GDP misses nature.',
  resources,
  background: [],
  candidate_count: 6
});

const connection = (id: string, extra: Partial<Connection> = {}): Connection => ({
  id,
  title: `Idea ${id}`,
  anchor: null,
  anchor_label: null,
  why: `why ${id}`,
  use: null,
  queries: ['q1', 'q2'],
  decision: 'open',
  evidence: null,
  isChecking: false,
  hasCheckFailed: false,
  development: null,
  ...extra
});

// the connections as they come back, without calling WeLearn
const prepare = (status: string, connections: Connection[]) => {
  const store = useConnectionsStore();
  vi.spyOn(store, 'isFor').mockReturnValue(true);
  store.findConnections = vi.fn();
  store.status = status as never;
  store.connections = connections;
  return store;
};
const ids = (wrapper: ReturnType<typeof mount>, selector = 'section') =>
  wrapper
    .find(selector)
    .findAllComponents(ConnectionCard)
    .map((card: VueWrapper) => (card.props() as { connection: Connection }).connection.id);

describe('SustainabilityAdditions (screen 3a)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('asks once for the confirmed course, in the teacher’s language', () => {
    const course = useCourseStore();
    course.language = 'en';
    const store = useConnectionsStore();
    store.findConnections = vi.fn();
    mount(SustainabilityAdditions);
    expect(store.findConnections).toHaveBeenCalledWith(course.confirmedCourse, 'en');
  });

  it('keeps the work done for a course corrected since, and says so', async () => {
    const store = prepare('ready', [connection('idea-1', { decision: 'selected' })]);
    vi.mocked(store.isFor).mockReturnValue(false);
    const keepFor = vi.spyOn(store, 'keepFor');
    const wrapper = mount(SustainabilityAdditions);

    expect(store.findConnections).not.toHaveBeenCalled();
    expect(keepFor).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    await wrapper.find('[data-testid="find-again"]').trigger('click');
    expect(store.findConnections).toHaveBeenCalled();
  });

  it('says what WeLearn is doing while it looks', async () => {
    const store = prepare('thinking', []);
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find('[data-testid="thinking"]').exists()).toBe(true);

    store.connections = [
      connection('idea-1', { evidence: evidence('supported', [resource]) }),
      connection('idea-2', { isChecking: true })
    ];
    store.status = 'searching';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="searching"]').exists()).toBe(true);
    // each idea is shown as soon as it is judged; the other one is still being looked for
    expect(ids(wrapper)).toEqual(['idea-1', 'idea-2']);
    expect(wrapper.findAll('[data-testid="pending"]')).toHaveLength(1);
    expect(wrapper.find('[data-testid="selected-count"]').exists()).toBe(false);
  });

  it('shows the supported first, the unsupported apart, and only counts the forced', () => {
    prepare('ready', [
      connection('idea-1', { evidence: evidence('unsupported') }),
      connection('idea-2', { evidence: evidence('supported', [resource]) }),
      connection('idea-3', { evidence: evidence('forced') }),
      connection('idea-4', { hasCheckFailed: true })
    ]);
    const wrapper = mount(SustainabilityAdditions);

    expect(ids(wrapper, '.connection-list')).toEqual(['idea-2', 'idea-4']);
    expect(ids(wrapper, '[data-testid="unsupported-list"]')).toEqual(['idea-1']);
    expect(wrapper.find('[data-testid="left-out"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="no-support"]').exists()).toBe(false);
  });

  it('says when nothing is supported, and when nothing was found and why', async () => {
    const store = prepare('ready', [connection('idea-1', { evidence: evidence('unsupported') })]);
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find('[data-testid="no-support"]').exists()).toBe(true);

    store.connections = [];
    store.noneReason = 'A course on method only.';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="no-connections"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="none-reason"]').exists()).toBe(true);
  });

  it.each(['unavailable', 'error'])('says the %s failure and tries again', async (status) => {
    const store = prepare(status, []);
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find(`[data-testid="additions-${status}"]`).exists()).toBe(true);
    await wrapper.find('[data-testid="retry"]').trigger('click');
    expect(store.findConnections).toHaveBeenCalled();
  });

  it('lets the teacher choose a connection, set one aside and bring it back', async () => {
    const store = prepare('ready', [
      connection('idea-1', { evidence: evidence('supported', [resource]) }),
      connection('idea-2', { evidence: evidence('supported', [resource]) })
    ]);
    const wrapper = mount(SustainabilityAdditions);

    await wrapper.findAll('[data-testid="select"]')[0].trigger('click');
    expect(store.connections[0].decision).toBe('selected');
    expect(wrapper.find('[data-testid="selected"]').exists()).toBe(true);
    await wrapper.find('[data-testid="unselect"]').trigger('click');
    expect(store.connections[0].decision).toBe('open');

    await wrapper.findAll('[data-testid="set-aside"]')[1].trigger('click');
    expect(ids(wrapper, '.connection-list')).toEqual(['idea-1']);
    await wrapper.find('[data-testid="bring-back"]').trigger('click');
    expect(ids(wrapper, '.connection-list')).toEqual(['idea-1', 'idea-2']);
  });

  it('counts the accepted changes once a chosen connection is developed', async () => {
    const store = prepare('ready', [
      connection('idea-1', { decision: 'selected', evidence: evidence('supported', [resource]) })
    ]);
    const wrapper = mount(SustainabilityAdditions);
    expect(wrapper.find('[data-testid="accepted-count"]').exists()).toBe(false);

    store.connections[0].development = {
      status: 'thinking',
      proposal: null,
      decision: 'pending',
      edited: null,
      placement: null,
      retryAfter: null
    };
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-testid="accepted-count"]').text()).toBe(
      'tutor.additions.acceptedCount'
    );
  });
});

describe('ConnectionCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('says where it connects, why, and the sources behind it', async () => {
    const course = useCourseStore();
    course.courseObjectives = [{ value: 'Define GDP.', origin: 'extracted' }];
    const wrapper = mount(ConnectionCard, {
      props: {
        connection: connection('idea-1', {
          anchor: 'Define GDP.',
          evidence: { ...evidence('supported', [resource]), background: [resource] }
        })
      }
    });

    expect(wrapper.find('[data-testid="anchor-ref"] summary').text()).toBe(
      'tutor.additions.objectiveRef'
    );
    expect(wrapper.find('[data-testid="anchor-full"]').text()).toBe('Define GDP.');
    // the judgement's words, once judged
    expect(wrapper.find('[data-testid="why"]').text()).toBe('Judged: GDP misses nature.');
    expect(wrapper.find('[data-testid="resources"] summary').text()).toContain('The Conversation');
    expect(wrapper.find('[data-testid="background"]').exists()).toBe(true);
    const link = wrapper.find('[data-testid="resource-title"]');
    expect(link.attributes('href')).toBe('https://example.org/a#:~:text=GDP%20misses%20nature.');
    expect(wrapper.find('[data-testid="excerpt"]').text()).toBe('GDP misses nature.');
  });

  it('names a topic as written, and the idea’s own why until judged', () => {
    const course = useCourseStore();
    course.courseTopics = [{ value: 'GDP', origin: 'extracted' }];
    const wrapper = mount(ConnectionCard, {
      props: { connection: connection('idea-1', { anchor: 'GDP' }) }
    });
    expect(wrapper.find('[data-testid="anchor-topic"]').text()).toBe('GDP');
    expect(wrapper.find('[data-testid="why"]').text()).toBe('why idea-1');
    expect(wrapper.find('[data-testid="pending"]').exists()).toBe(true);
  });

  it('checks again an idea that could not be checked', async () => {
    const store = useConnectionsStore();
    const recheck = vi.spyOn(store, 'recheck').mockResolvedValue();
    const wrapper = mount(ConnectionCard, {
      props: { connection: connection('idea-1', { hasCheckFailed: true }) }
    });
    expect(wrapper.find('[data-testid="unchecked"]').text()).toContain('tutor.additions.unchecked');
    await wrapper.find('[data-testid="recheck"]').trigger('click');
    expect(recheck).toHaveBeenCalledWith('idea-1');

    await wrapper.setProps({
      connection: connection('idea-1', { hasCheckFailed: true, isChecking: true })
    });
    expect(wrapper.find('[data-testid="unchecked"]').text()).toContain(
      'tutor.additions.rechecking'
    );
    expect(wrapper.find('[data-testid="recheck"]').exists()).toBe(false);
  });

  it('develops a chosen connection once its resources are judged, then shows the change', async () => {
    const store = useConnectionsStore();
    const develop = vi.spyOn(store, 'develop').mockResolvedValue();
    const wrapper = mount(ConnectionCard, {
      props: { connection: connection('idea-1', { decision: 'selected' }) }
    });
    // still being judged: nothing to develop it from yet
    expect(wrapper.find('[data-testid="develop"]').attributes('disabled')).toBeDefined();

    await wrapper.setProps({
      connection: connection('idea-1', {
        decision: 'selected',
        evidence: evidence('supported', [resource])
      })
    });
    await wrapper.find('[data-testid="develop"]').trigger('click');
    expect(develop).toHaveBeenCalledWith('idea-1');

    await wrapper.setProps({
      connection: connection('idea-1', {
        decision: 'selected',
        evidence: evidence('supported', [resource]),
        development: {
          status: 'thinking',
          proposal: null,
          decision: 'pending',
          edited: null,
          placement: null,
          retryAfter: null
        }
      })
    });
    expect(wrapper.find('[data-testid="develop"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="development"]').exists()).toBe(true);
  });

  it('says plainly that an idea has no supporting source', () => {
    const wrapper = mount(ConnectionCard, {
      props: { connection: connection('idea-1', { evidence: evidence('unsupported') }) }
    });
    expect(wrapper.find('[data-testid="unsupported"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="where"]').exists()).toBe(false);
  });
});

describe('ResourceList', () => {
  it('shortens a long passage at a word, whole on hover, and bookmarks a resource', async () => {
    const long = `${'GDP misses nature '.repeat(20)}end`;
    const wrapper = mount(ResourceList, {
      props: { resources: [{ ...resource, evidence: long }] }
    });

    const excerpt = wrapper.find('[data-testid="excerpt"]');
    expect(excerpt.attributes('title')).toBe(long);
    expect(excerpt.text().endsWith('…')).toBe(true);
    expect(excerpt.text().length).toBeLessThanOrEqual(221);
    expect(excerpt.text()).not.toMatch(/ …$/);

    await wrapper.find('[data-testid="toggleBookmark"]').trigger('click');
    expect(bookmarks.toggleBookmark).toHaveBeenCalledWith(resource.document);
  });
});
