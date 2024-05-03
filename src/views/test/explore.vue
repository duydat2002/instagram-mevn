<script setup lang="ts">
import { $getRoot, $getSelection, EditorState } from "lexical";
import {
  LexicalComposer,
  LexicalContentEditable,
  LexicalHistoryPlugin,
  LexicalPlainTextPlugin,
  useLexicalComposer,
} from "lexical-vue";
import { ref } from "vue";
import MentionPlugin from "./MentionPlugin.vue";
import OnChangePlugin from "./OnChangePlugin.vue";

const editorState = ref<EditorState>();

const config = {
  namespace: "MyEditor",
  theme: {
    // Theme styling goes here
  },
  onError(error: Error) {
    // Catch any errors that occur during Lexical updates and log them
    // or throw them as needed. If you don't throw them, Lexical will
    // try to recover gracefully without losing user data.
    console.error(error);
  },
};

function onChange(editorStateS: EditorState) {
  // Call toJSON on the EditorState object, which produces a serialization safe string
  // console.log(editorStateS.toJSON());
  // However, we still have a JavaScript object, so we need to convert it to an actual string with JSON.stringify
}
</script>

<template>
  <div class="w-[400px] h-[400px] mx-auto mt-20 border border-borderColor rounded-2xl p-5">
    <LexicalComposer :initial-config="config">
      <LexicalPlainTextPlugin>
        <template #contentEditable>
          <LexicalContentEditable />
        </template>
        <template #placeholder>
          <div class="absolute">Enter some text...</div>
        </template>
      </LexicalPlainTextPlugin>
      <LexicalHistoryPlugin />
      <MentionPlugin />
      <OnChangePlugin @change="onChange" />
    </LexicalComposer>
  </div>
  <div>ABC</div>
</template>
