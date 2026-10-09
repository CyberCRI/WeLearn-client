<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { reactive, ref, type Ref } from 'vue';
import EmailIcon from '@/components/icons/EmailIcon.vue';
import PasswordIcon from '@/components/icons/PasswordIcon.vue';
import ShowPassIcon from '@/components/icons/ShowPassIcon.vue';
import HidePassIcon from '@/components/icons/HidePassIcon.vue';

const form = reactive({
  name: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
  checkPassword: undefined
});

const authStore = useAuthStore();
const showCheckPass: Ref<boolean> = ref(false);
const showPass: Ref<boolean> = ref(false);

const handleSubmitAlert = () => {
  authStore.register(form);
  window.alert('the feature will be available soon');
};
</script>

<template>
  <h1 class="title is-3 is-size-5-mobile">{{ $t('authentication.registerTitle') }}</h1>
  <div class="box">
    <form @submit.prevent="handleSubmitAlert">
      <div>
        <label for="name">First name <span class="has-text-danger">*</span></label>
        <input class="input" type="text" id="name" v-model="form.name" />
      </div>
      <div>
        <label for="last_name">Last name <span class="has-text-danger">*</span></label>
        <input class="input" type="text" id="last_name" v-model="form.lastName" />
      </div>
      <div class="field">
        <label for="email">Email <span class="has-text-danger">*</span></label>
        <p class="control has-icons-left has-icons-right">
          <input class="input" type="email" required v-model="form.email" />
          <span class="icon is-small is-left my-auto">
            <div class="icon-wrapper">
              <EmailIcon />
            </div>
          </span>
        </p>
      </div>
      <div class="field">
        <label for="pass">Password <span class="has-text-danger">*</span></label>
        <div class="is-flex">
          <p class="control has-icons-left">
            <input
              class="input"
              :type="showPass ? 'text' : 'password'"
              id="pass"
              minlength="8"
              required
              v-model="form.password"
            />
            <span class="icon is-small is-left my-auto">
              <div class="icon-wrapper">
                <PasswordIcon />
              </div>
            </span>
          </p>
          <div class="ml-2 mt-2 is-clickable" @click="showPass = !showPass">
            <HidePassIcon v-if="showPass" />
            <ShowPassIcon v-else />
          </div>
        </div>
      </div>

      <div class="field">
        <label for="checkpass">Confirm password <span class="has-text-danger">*</span></label>
        <div class="is-flex">
          <p class="control has-icons-left has-icons-right">
            <input
              class="input"
              :type="showCheckPass ? 'text' : 'password'"
              id="checkpass"
              minlength="8"
              required
              v-model="form.checkPassword"
              :class="{ 'is-danger': form.password !== form.checkPassword }"
            />
            <span class="icon is-small is-left">
              <div class="icon-wrapper">
                <PasswordIcon />
              </div>
            </span>
            <span class="icon is-small is-right">
              <div class="icon-wrapper"></div>
            </span>
          </p>
          <div class="ml-2 mt-2 is-clickable" @click="showCheckPass = !showCheckPass">
            <HidePassIcon v-if="showCheckPass" />
            <ShowPassIcon v-else />
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link class="button" type="submit" to="/">{{
          $t('authentication.cancelButton')
        }}</router-link>
        <input
          class="button is-primary"
          type="submit"
          :value="$t('authentication.registerButton')"
          :disabled="form.password !== form.checkPassword"
        />
      </div>
    </form>
  </div>
</template>
<style lang="css" scoped>
.icon-wrapper {
  position: relative;
  top: 0.8rem;
  left: 0.5rem;
}

h1 {
  margin: auto;
  margin-top: 8rem;
  text-align: center;
}

label {
  font-weight: 700;
}

.box {
  width: 25%;
  min-width: 420px;
  margin: auto;
  margin-top: 1rem;
  padding: 4rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-buttons {
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 750px) {
  .box {
    width: 100%;
    min-width: unset;
    padding: 1rem 2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  h1 {
    margin: auto;
    margin-top: 1rem;
    text-align: center;
  }

  .action-buttons {
    margin-top: 0.5rem;
  }
}
</style>
