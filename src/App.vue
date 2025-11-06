<template id="body">
  <div id="app">
    <header>
      <RouterLink to="/profil">👋 Profil</RouterLink>
    </header>
    <div id="content">
      <nav id="navBar" class="sideBar">
        <RouterLink to="./home">🏠 Home</RouterLink>
        <RouterLink to="/todo">📝 ToDo</RouterLink>
        <RouterLink to="/cinema">📝 CinemaTech</RouterLink>
        <RouterLink to="/link">📝 LinkPlace</RouterLink>
        <RouterLink to="/hello">👋 Credits</RouterLink>
      </nav>
      <div id="mainContent">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style scoped>
@import "../public/styles.css";
#app{
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  min-height: 100vh;
}
header {
  display: flex;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  border-bottom: 1px solid var(--border-primary);
  box-shadow: var(--shadow-sm);
  margin: 0;
  height: var(--height-xs);
}
#content{
  display: flex;
  flex-direction: row;
  min-height: var(--height-lg);
}

#mainContent{
  width: 100%;
  display: flex;
  margin: var(--spacing-xl);
}
</style>