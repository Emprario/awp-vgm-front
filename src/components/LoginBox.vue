<template>
  <div>
    <fieldset class="pr-15 pf-15">
      <legend class="text-2xl">Login</legend>
      <input class="flex p-2 w-full row" name="username" type="email"/>
      <span>Username</span>
      <input class="flex p-2 w-full row" name="password" type="email"/>
      <span>Password</span>
    </fieldset> 
  </div>
</template>

<script>

</script>

<style lang="css" scoped>

input {
  background-color: #FFFFFFCC;
  color: var(--color-pureblack);
  border-radius: 1em;
  border: none;
  padding-top: .8em;
}

input:valid:not(:focus) + span {
  position: relative;
  top: -2em;
  left: 2em;
  color: var(--color-pureblack);
  font-size: 1em;
}

input + span {
  position: relative;
  top: -4em;
  left: 2em;
  color: var(--color-pureblack);
  font-size: .8em;
  transition:  .5s;
}

</style>