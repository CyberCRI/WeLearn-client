import { ref, type Ref } from 'vue';

export const useGoTo = (scrollerRef: Ref) => {
  const displayArrow = ref(false);

  function handleDisplayArrow() {
    if (scrollerRef.value.scrollTop > scrollerRef.value.clientHeight) {
      displayArrow.value = true;
    } else {
      displayArrow.value = false;
    }
  }

  return {
    displayArrow,
    handleDisplayArrow
  };
};
