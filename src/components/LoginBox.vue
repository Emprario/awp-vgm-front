<template>
  <div>
    <fieldset class="pr-15 pf-15 flex-col justify-center">
      <legend class="text-2xl">Login</legend>
      <label for="username">Username</label>
      <input class="flex p-2 w-full row" name="username" type="text" placeholder=""/>
      <span>Username</span>
      <label for="password">Password</label>
      <input class="flex p-2 w-full row" name="password" type="password" placeholder=""/>
      <span>Password</span>
      <br>
      <input type="submit">Login to THE VGF</input>
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
  z-index: 2;
  padding-left: 1em
}

input:placeholder-shown + span {
  position: relative;
  top: -2em;
  left: 2em;
  color: var(--color-pureblack);
  font-size: 1em;
  transition: .5s;
  user-select: none;
  z-index: 1;
}

input + span,
input:focus + span {
  position: relative;
  top: -4em;
  left: 2em;
  color: var(--color-pureblack);
  font-size: .8em;
  transition: .5s;
  user-select: none;
  z-index: 1;
}

label {
  display: none;
}

input[type="submit"] {
  background-color: unset;
  color: unset;
  border: solid 3px;
  padding-top: unset;
  z-index: unset;
  padding-left: unset;
}

</style>