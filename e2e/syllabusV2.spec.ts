// the syllabus v2 paths of /tutor, behind the syllabusV2 flag (off in this project, so opened with
// ?preview). the API calls of the "I have a course" path are mocked in base.ts
import { test, expect } from './base';
import { acceptFirstConnection, confirmCourse, connectionCards } from './coursePath';
import { syllabusFile } from './data';

test.describe('Tutor path choice (syllabusV2)', () => {
  test('is not there without the flag: the page is the current creator', async ({ page }) => {
    await page.goto('/tutor');
    await expect(page.getByTestId('file-input')).toBeAttached();
    await expect(page.getByTestId('option-scratch')).toHaveCount(0);
  });

  test('asks first, then opens the current creator from scratch', async ({ page }) => {
    await page.goto('/tutor?preview=syllabusV2');
    await expect(page.getByTestId('file-input')).toHaveCount(0);

    await page.getByTestId('option-scratch').click();
    await expect(page.getByTestId('chosen-path')).toBeVisible();
    await expect(page.getByTestId('file-input')).toBeAttached();
  });

  test('opens the existing course path and can go back to the question', async ({ page }) => {
    await page.goto('/tutor?preview=syllabusV2');
    await page.getByTestId('option-existing').click();
    await expect(page.getByTestId('chosen-path')).toBeVisible();
    await expect(page.getByTestId('file-input')).toHaveCount(0);

    await page.getByTestId('change-path').click();
    await expect(page.getByTestId('option-existing')).toBeVisible();
  });

  test('from scratch still takes up to 3 course materials', async ({ page }) => {
    await page.goto('/tutor?preview=syllabusV2');
    await page.getByTestId('option-scratch').click();
    await page.getByTestId('file-input').setInputFiles(
      ['a', 'b', 'c'].map((name) => ({
        name: `${name}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from(`material ${name}`)
      }))
    );
    await expect(page.getByTestId('file-list').locator('li')).toHaveCount(3);
  });
});

test.describe('Tutor existing course path (syllabusV2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tutor?preview=syllabusV2');
  });

  test("reads the teacher's course and opens its review", async ({ page }) => {
    await page.getByTestId('option-existing').click();
    await expect(page.getByTestId('read-course-button')).toBeDisabled();

    await page.getByTestId('course-file-input').setInputFiles(syllabusFile);
    await page.getByTestId('course-lang').selectOption('en');
    const reading = page.waitForRequest('**/tutor/course/read');
    await page.getByTestId('read-course-button').click();

    await expect(page.getByTestId('course-recap')).toContainText('syllabus.txt');
    expect((await reading).postData()).toContain('name="lang"');

    // screen 2: what WeLearn read, correctable, then confirmed and folded
    await expect(page.getByTestId('overview-title')).toContainText('Ecology');
    await expect(page.getByTestId('topic')).toHaveText(['Soil ecology']);
    // the teaching context the syllabus states, read from its text and open for checking
    await expect(page.locator('#context-sessions')).toHaveValue('12');
    await page.getByTestId('edit-topics').click();
    await page.getByTestId('add-topic').click();
    await page.getByTestId('topic-title').last().fill('Water');
    await page.getByTestId('save-topics').click();
    await expect(page.getByTestId('topic')).toHaveText(['Soil ecology', 'Water']);

    await page.getByTestId('confirm-course').click();
    await expect(page.getByTestId('review-recap')).toContainText('Ecology');
    await page.getByTestId('review-recap').getByRole('button').click();
    await expect(page.getByTestId('confirm-course')).toBeVisible();
  });

  test('reads again, alone, the course picked in a document holding several', async ({ page }) => {
    const focuses: (string | null)[] = [];
    await page.route('**/tutor/course/read', async (route) => {
      const body = route.request().postData() || '';
      const focus = body.match(/name="focus"\r\n\r\n([^\r]*)/)?.[1] ?? null;
      focuses.push(focus);
      await route.fulfill({
        json: {
          text: 'UE 1 Economics\nEverything\nUE 2 Law\nWater law',
          is_text_truncated: false,
          is_partial: false,
          reading: {
            title: focus,
            material_type: 'course_plan',
            courses_found: focus ? [] : ['UE 1 Economics', 'UE 2 Law'],
            objectives: [],
            topics: [{ title: focus ? 'Water law' : 'Everything', subtopics: [], source: null }],
            sessions: []
          }
        }
      });
    });
    await page.getByTestId('option-existing').click();
    await page.getByTestId('course-file-input').setInputFiles(syllabusFile);
    await page.getByTestId('read-course-button').click();

    await page.getByTestId('choose-course').filter({ hasText: 'UE 2 Law' }).click();
    await expect(page.getByTestId('topic')).toHaveText(['Water law']);
    await expect(page.getByTestId('course-choice')).toHaveCount(0);
    expect(focuses).toEqual([null, 'UE 2 Law']);
  });

  test('suggests connections and develops the chosen one into a change', async ({ page }) => {
    const ideasAsked = page.waitForRequest('**/tutor/course/connection_ideas');
    await confirmCourse(page);

    await expect(page.getByTestId('selected-count')).toBeVisible();
    expect((await ideasAsked).postDataJSON().course).toMatchObject({
      title: 'Ecology',
      topics: [{ title: 'Soil ecology', subtopics: [] }]
    });
    const cards = connectionCards(page);
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('Soil carbon');
    await expect(page.getByTestId('unsupported-list')).toContainText('1');

    await cards.first().getByTestId('select').click();
    await expect(cards.first().getByTestId('selected')).toBeVisible();

    // the chosen connection becomes one checked change, accepted with the teacher's wording
    const adaptationAsked = page.waitForRequest('**/tutor/course/adaptation');
    await cards.first().getByTestId('develop').click();
    const change = cards.first().getByTestId('development');
    await expect(change.getByTestId('change-text')).toHaveText('Add how soils store carbon.');
    await expect(change.getByTestId('placement-part')).toHaveText('Soil ecology');
    // where the word document will add it
    await expect(change.getByTestId('placement-line')).toHaveText(
      'Après « Theme 1: Soil ecology »'
    );
    expect((await adaptationAsked).postDataJSON().connection).toMatchObject({
      title: 'Soil carbon',
      resources: [{}]
    });
    const acceptedCount = page.getByTestId('accepted-count');
    await expect(acceptedCount).toHaveText('Aucune modification acceptée pour le moment');

    // accepted as proposed, then taken back
    await change.getByTestId('accept-change').click();
    await expect(change.getByTestId('change-accepted')).toBeVisible();
    await expect(acceptedCount).toContainText('1 modification acceptée');
    await change.getByTestId('reconsider').click();
    await expect(acceptedCount).toHaveText('Aucune modification acceptée pour le moment');

    await change.getByTestId('edit-change').click();
    await change.getByTestId('change-editor').fill('Add a session on soil carbon.');
    await change.getByTestId('save-change').click();
    await expect(change.getByTestId('change-accepted')).toBeVisible();
    await expect(change.getByTestId('change-text')).toHaveText('Add a session on soil carbon.');
    await expect(acceptedCount).toContainText('1 modification acceptée');
  });

  test('goes from the course to its updated word document', async ({ page }) => {
    await confirmCourse(page);
    await acceptFirstConnection(page);
    await expect(page.getByTestId('accepted-count')).toContainText('1 modification acceptée');

    // screen 4: the syllabus's own text, the accepted change where it goes
    await page.getByTestId('to-updated').click();
    const updated = page.getByTestId('updated');
    await expect(updated.getByTestId('complete-document')).toBeVisible();
    await expect(updated.getByTestId('document-line').nth(1)).toHaveText('Theme 1: Soil ecology');
    await expect(updated.getByTestId('added').getByTestId('change-text')).toHaveText(
      'Add how soils store carbon.'
    );
    await expect(page.getByTestId('additions-recap')).toBeVisible();

    // downloaded as word, and counted
    const counted = page.waitForRequest('**/metric/syllabus_downloaded');
    const downloading = page.waitForEvent('download');
    await updated.getByTestId('download-complete').click();
    expect((await downloading).suggestedFilename()).toBe('Ecology-complet-mis-a-jour.docx');
    await counted;
  });

  test('tells a file without text (a scanned pdf)', async ({ page }) => {
    await page.route('**/tutor/course/read', (route) =>
      route.fulfill({
        status: 422,
        json: { detail: { message: 'No text', code: 'EMPTY_DOCUMENT_TEXT' } }
      })
    );
    await page.getByTestId('option-existing').click();
    await page.getByTestId('course-file-input').setInputFiles(syllabusFile);
    await page.getByTestId('read-course-button').click();

    await expect(page.getByTestId('read-error')).toBeVisible();
    await expect(page.getByTestId('course-file')).toContainText('syllabus.txt');
  });
});
