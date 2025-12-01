<template>
  <div id="guidelinesPage" class="mainComponent">

    <header>
      <h1 class="title1">Forum Guidelines</h1>
    </header>

    <div id="guidelinesContainer" class="post">

      <section class="rule-block">
        <h2 class="title2">1. Be Respectful</h2>
        <p class="rule-text">
          • Treat everyone with courtesy.<br>
          • No insults, harassment, or discrimination.<br>
          • Debate ideas, not individuals.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">2. Stay On Topic</h2>
        <p class="rule-text">
          • Post in the correct category.<br>
          • Avoid derailing discussions or posting unrelated content.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">3. Write Clearly</h2>
        <p class="rule-text">
          • Use proper grammar and clear sentences.<br>
          • Avoid excessive formatting or ALL CAPS.<br>
          • Use descriptive and meaningful titles.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">4. No Spam or Self-Promotion</h2>
        <p class="rule-text">
          • Do not spam posts or links.<br>
          • Promotion is only allowed with staff approval.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">5. Protect Privacy</h2>
        <p class="rule-text">
          • Do not share personal or sensitive information.<br>
          • Report suspicious or dangerous activity.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">6. Forbidden Content</h2>
        <p class="rule-text">
          • No illegal content or explicit material.<br>
          • No hacking instructions.<br>
          • No copyrighted content without permission.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">7. Search Before Posting</h2>
        <p class="rule-text">
          • Make sure your question doesn’t already exist.<br>
          • Avoid creating duplicate topics.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">8. Be Constructive</h2>
        <p class="rule-text">
          • Provide helpful and respectful feedback.<br>
          • Criticism is welcome when constructive and solution-oriented.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">9. Use English Only</h2>
        <p class="rule-text">
          • All posts must be written in English to maintain clarity.
        </p>
        <div class="separator"></div>
      </section>

      <section class="rule-block">
        <h2 class="title2">10. Follow Staff Instructions</h2>
        <p class="rule-text">
          • Moderators may delete posts.<br>
          • Repeated violations may lead to sanctions.
        </p>
      </section>

    </div>
  </div>
</template>

<script>
export default {
  name: "ForumGuidelines"
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
#guidelinesPage {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  min-height: 0;
}

#guidelinesContainer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.rule-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.rule-text {
  margin: 0;
  color: var(--secondary-primary);
  line-height: 1.6;
}

.separator {
  border: 1px solid var(--secondary-primary);
  opacity: 0.4;
  margin-top: var(--spacing-md);
}
</style>
