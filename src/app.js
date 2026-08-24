import { recordsFromCsv, validateChapter } from "./scenario.js";

const CHAPTERS = Object.freeze([
  Object.freeze({
    id: "CH01",
    label: "第一章",
    title: "夏の山荘",
    endTitle: "第一章終了",
    scenarioUrl: "data/scenario/第一章_夏の山荘_台本.csv",
    specification: Object.freeze({
      chapterId: "CH01",
      recordCount: 146,
      typeCounts: Object.freeze({ dialogue: 96, narration: 42, direction: 8 }),
    }),
  }),
  Object.freeze({
    id: "CH02",
    label: "第二章",
    title: "帰ってきた便箋",
    endTitle: "第二章終了",
    scenarioUrl: "data/scenario/第二章_帰ってきた便箋_台本.csv",
    specification: Object.freeze({
      chapterId: "CH02",
      recordCount: 164,
      typeCounts: Object.freeze({ dialogue: 108, narration: 45, direction: 11 }),
    }),
  }),
  Object.freeze({
    id: "CH03",
    label: "第三章",
    title: "探偵と助手",
    endTitle: "第三章終了",
    scenarioUrl: "data/scenario/第三章_探偵と助手_台本.csv",
    specification: Object.freeze({
      chapterId: "CH03",
      recordCount: 294,
      scenes: Object.freeze([
        "Scene01", "Scene02", "Scene03", "Scene04", "Scene05", "Scene06",
        "Scene07", "Scene08", "Scene09", "Scene10", "Scene11", "Scene12",
      ]),
      typeCounts: Object.freeze({ dialogue: 202, narration: 79, direction: 13 }),
    }),
  }),
  Object.freeze({
    id: "CH04",
    label: "第四章",
    title: "調査開始",
    endTitle: "第四章終了",
    scenarioUrl: "data/scenario/第四章_調査開始_台本.csv",
    specification: Object.freeze({
      chapterId: "CH04",
      recordCount: 137,
      scenes: Object.freeze([
        "Scene01", "Scene02", "Scene03", "Scene04", "Scene05", "Scene06",
      ]),
      typeCounts: Object.freeze({ dialogue: 80, narration: 42, direction: 12, document: 3 }),
    }),
  }),
  Object.freeze({
    id: "CH05",
    label: "第五章",
    title: "書かれたこと",
    endTitle: "第五章終了",
    scenarioUrl: "data/scenario/第五章_書かれたこと_台本.csv",
    specification: Object.freeze({
      chapterId: "CH05",
      recordCount: 150,
      scenes: Object.freeze([
        "Scene01", "Scene02", "Scene03", "Scene04",
        "Scene05", "Scene06", "Scene07", "Scene08",
      ]),
      typeCounts: Object.freeze({ dialogue: 81, narration: 57, direction: 9, document: 3 }),
    }),
  }),
]);

const CHAPTER_BY_ID = new Map(CHAPTERS.map((chapter) => [chapter.id, chapter]));

const CH2_BACKGROUNDS = Object.freeze({
  livingDining: "assets/images/backgrounds/BG_CH2_KANAE_HOME_LIVING_DINING.png",
  livingDiningEvening: "assets/images/backgrounds/BG_CH2_KANAE_HOME_LIVING_DINING_EVENING.png",
  livingDiningNight: "assets/images/backgrounds/BG_CH2_KANAE_HOME_LIVING_DINING_NIGHT.png",
  entranceInterior: "assets/images/backgrounds/BG_CH2_KANAE_HOME_ENTRANCE_INTERIOR.png",
  entranceInteriorEvening: "assets/images/backgrounds/BG_CH2_KANAE_HOME_ENTRANCE_INTERIOR_EVENING.png",
  entranceExterior: "assets/images/backgrounds/BG_CH2_KANAE_HOME_ENTRANCE_EXTERIOR.png",
  entranceShelf: "assets/images/backgrounds/BG_CH2_KANAE_HOME_ENTRANCE_SHELF.png",
});

const AUDIO_ASSETS = Object.freeze({
  bgm: Object.freeze({
    BGM_CH1_SUMMER_LODGE_FAMILY: "assets/audio/bgm/BGM_CH1_SUMMER_LODGE_FAMILY.wav",
    BGM_CH1_RIVERSIDE_SUBTLE_UNEASE: "assets/audio/bgm/BGM_CH1_RIVERSIDE_SUBTLE_UNEASE.wav",
    BGM_CH1_LODGE_QUIET_NIGHT: "assets/audio/bgm/BGM_CH1_LODGE_QUIET_NIGHT.wav",
    BGM_CH1_SUMMER_DEPARTURE: "assets/audio/bgm/BGM_CH1_SUMMER_DEPARTURE.wav",
    BGM_CH2_EVERYDAY_UNEASE: "assets/audio/bgm/BGM_CH2_EVERYDAY_UNEASE.mp3",
    BGM_CH2_QUIET_ANXIETY: "assets/audio/bgm/BGM_CH2_QUIET_ANXIETY.mp3",
    BGM_CH3_DETECTIVE_OFFICE: "assets/audio/bgm/BGM_CH3_DETECTIVE_OFFICE.mp3",
    BGM_CH3_OBSERVATION: "assets/audio/bgm/BGM_CH3_OBSERVATION.mp3",
    BGM_CH3_YAMAZOE_REQUEST: "assets/audio/bgm/BGM_CH3_YAMAZOE_REQUEST.mp3",
    BGM_CH3_CURSED_LETTER_REVEAL: "assets/audio/bgm/BGM_CH3_CURSED_LETTER_REVEAL.mp3",
  }),
  environment: Object.freeze({
    ENV_CH1_MOUNTAIN_SUMMER_DAY: "assets/audio/sfx/ENV_CH1_MOUNTAIN_SUMMER_DAY.mp3",
    ENV_CH1_RIVERSIDE_SUMMER: "assets/audio/sfx/ENV_CH1_RIVERSIDE_SUMMER.mp3",
    ENV_CH1_LODGE_NIGHT: "assets/audio/sfx/ENV_CH1_LODGE_NIGHT.mp3",
    ENV_CH1_MOUNTAIN_SUMMER_MORNING: "assets/audio/sfx/ENV_CH1_MOUNTAIN_SUMMER_MORNING.mp3",
    ENV_CH2_RESIDENTIAL_SUMMER_DAY_EVENING: "assets/audio/sfx/ENV_CH2_RESIDENTIAL_SUMMER_DAY_EVENING.mp3",
    ENV_CH2_RESIDENTIAL_SUMMER_NIGHT: "assets/audio/sfx/ENV_CH2_RESIDENTIAL_SUMMER_NIGHT.mp3",
  }),
  sfx: Object.freeze({
    SFX_CH1_DRAWER_OPEN: "assets/audio/sfx/SFX_CH1_DRAWER_OPEN.mp3",
  }),
});

const TEMPORARY_VOLUME = Object.freeze({
  bgm: 0.32,
  environment: 0.38,
  sfx: 0.55,
});

const CH2_ENVIRONMENT_VOLUME = Object.freeze({
  ENV_CH2_RESIDENTIAL_SUMMER_DAY_EVENING: 0.30,
  ENV_CH2_RESIDENTIAL_SUMMER_NIGHT: 0.28,
});

const AUTO_TIMING = Object.freeze({
  baseMs: 1800,
  perCharacterMs: 80,
  minMs: 2500,
  maxMs: 8000,
  directionMinMs: 3000,
});

const ADVANCE_LOCK_MS = 180;
const AUDIO_FADE_MS = 450;
const SAVE_STORAGE_KEY = "cursedLetterSaveV1";
const SAVE_FORMAT_VERSION = 1;
const GAME_DATA_VERSION = "CH01-CH02-2026-08-14";
const DOCUMENT_DISPLAY_ASSETS = Object.freeze({
  "DOC_CH4_1998_RIVERSIDE_NEWSPAPER_ARTICLE.png": Object.freeze({
    src: "assets/images/ui/DOC_CH4_1998_RIVERSIDE_NEWSPAPER_ARTICLE.png",
    title: "山峡日報　1998年8月14日",
    alt: "山峡日報の記事。川辺で女性の遺体発見、転落事故か",
  }),
  "DOC_CH4_1996_FOUR_MISSING_NEWSPAPER_CLIPPING.png": Object.freeze({
    src: "assets/images/ui/DOC_CH4_1996_FOUR_MISSING_NEWSPAPER_CLIPPING.png",
    title: "山峡日報　1996年資料",
    alt: "山峡日報の記事。山荘を利用した四人のその後の消息は確認できない",
  }),
  "DOC_CH4_1996_CURSED_LETTER_BBS_LOG.png": Object.freeze({
    src: "assets/images/ui/DOC_CH4_1996_CURSED_LETTER_BBS_LOG.png",
    title: "保存ログ　1996年",
    alt: "1996年の通信ログ。山荘の古い便箋と呪いの便箋という呼び名が記されている",
  }),
});

const elements = {
  novel: document.querySelector("#novel"),
  titleScreen: document.querySelector("#title-screen"),
  loadingStatus: document.querySelector("#loading-status"),
  startButton: document.querySelector("#start-button"),
  titleLoadButton: document.querySelector("#title-load-button"),
  titleSaveSummary: document.querySelector("#title-save-summary"),
  gameScreen: document.querySelector("#game-screen"),
  background: document.querySelector("#background"),
  sceneLabel: document.querySelector("#scene-label"),
  speaker: document.querySelector("#speaker"),
  storyText: document.querySelector("#story-text"),
  textArea: document.querySelector("#text-area"),
  recordPosition: document.querySelector("#record-position"),
  autoButton: document.querySelector("#auto-button"),
  saveButton: document.querySelector("#save-button"),
  loadButton: document.querySelector("#load-button"),
  soundButton: document.querySelector("#sound-button"),
  saveDialog: document.querySelector("#save-dialog"),
  saveDialogSummary: document.querySelector("#save-dialog-summary"),
  confirmLoadButton: document.querySelector("#confirm-load-button"),
  deleteSaveButton: document.querySelector("#delete-save-button"),
  closeSaveDialogButton: document.querySelector("#close-save-dialog-button"),
  documentDialog: document.querySelector("#document-dialog"),
  documentDialogTitle: document.querySelector("#document-dialog-title"),
  documentDialogImage: document.querySelector("#document-dialog-image"),
  closeDocumentDialogButton: document.querySelector("#close-document-dialog-button"),
  saveFeedback: document.querySelector("#save-feedback"),
  endScreen: document.querySelector("#end-screen"),
  endTitle: document.querySelector("#end-title"),
  fatalError: document.querySelector("#fatal-error"),
  fatalErrorMessage: document.querySelector("#fatal-error-message"),
};

const state = {
  records: [],
  summaries: {},
  index: -1,
  currentChapterId: "",
  started: false,
  ended: false,
  advancing: false,
  advanceLockUntil: 0,
  autoEnabled: false,
  autoTimer: null,
  autoDueAt: 0,
  autoTimeScale: 1,
  muted: false,
  background: "",
  currentBgm: "",
  currentEnvironment: "",
  lastSfxRecord: "",
  saveFeedbackTimer: null,
  pendingAudioResume: false,
  processedRecordKeys: new Set(),
  visitedScenes: new Set(),
  events: [],
  errors: [],
};

const bgmAudio = createAudioChannel("bgm", true, TEMPORARY_VOLUME.bgm);
const environmentAudio = createAudioChannel("environment", true, TEMPORARY_VOLUME.environment);
const activeSfx = new Set();
const audioFadeTokens = new WeakMap();

function enableMaterialProtection(root) {
  root.querySelectorAll("img").forEach((image) => {
    image.draggable = false;
  });

  root.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  root.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
}

function createAudioChannel(kind, loop, volume) {
  const audio = new Audio();
  audio.preload = "auto";
  audio.loop = loop;
  audio.volume = volume;
  audio.dataset.channel = kind;
  audio.addEventListener("loadedmetadata", () => {
    state.events.push({ type: "media-loaded", kind, src: audio.getAttribute("src") });
  });
  audio.addEventListener("error", () => {
    state.errors.push({ type: "media-error", kind, src: audio.getAttribute("src"), code: audio.error?.code ?? null });
  });
  return audio;
}

function chapterTwoBackground(record) {
  if (record.scene_id === "Scene05" && record.sequence >= 16) {
    return CH2_BACKGROUNDS.entranceInteriorEvening;
  }

  if (record.scene_id === "Scene06") {
    if (record.sequence === 1) return CH2_BACKGROUNDS.entranceInterior;
    if (record.sequence <= 22) return CH2_BACKGROUNDS.entranceShelf;
    return CH2_BACKGROUNDS.livingDiningNight;
  }

  const mappings = {
    "自宅玄関・夕方": CH2_BACKGROUNDS.entranceInterior,
    "自宅リビング・夕方": CH2_BACKGROUNDS.livingDiningEvening,
    "リビング脇・夕方": CH2_BACKGROUNDS.livingDiningEvening,
    "自宅リビング・夜の初め": CH2_BACKGROUNDS.livingDiningNight,
    "自宅リビング・夜": CH2_BACKGROUNDS.livingDiningNight,
    "自宅リビング・朝": CH2_BACKGROUNDS.livingDining,
    "自宅玄関前・朝": CH2_BACKGROUNDS.entranceExterior,
    "ごみ集積所・朝": CH2_BACKGROUNDS.entranceExterior,
    "ごみ集積所・午前": CH2_BACKGROUNDS.entranceExterior,
    "自宅ダイニング・夕方": CH2_BACKGROUNDS.livingDiningEvening,
    "自宅玄関脇・夕方": CH2_BACKGROUNDS.entranceInterior,
    "自宅玄関脇・夜": CH2_BACKGROUNDS.entranceInterior,
  };
  const background = mappings[record.background];
  if (!background) {
    throw new Error(`CH02の背景割当がありません: ${record.scene_id}:${record.sequence} ${record.background}`);
  }
  return background;
}

function chapterTwoEnvironment(record) {
  const day = "ENV_CH2_RESIDENTIAL_SUMMER_DAY_EVENING";
  const night = "ENV_CH2_RESIDENTIAL_SUMMER_NIGHT";

  if (record.scene_id === "Scene01") return day;
  if (record.scene_id === "Scene02") return record.sequence < 25 ? day : night;
  if (record.scene_id === "Scene03") return night;
  if (record.scene_id === "Scene04") return day;
  if (record.scene_id === "Scene05") {
    return record.sequence >= 11 && record.sequence < 16 ? night : day;
  }
  return night;
}

function chapterTwoPeriod(backgroundLabel) {
  if (backgroundLabel.includes("夜")) return "night";
  if (backgroundLabel.includes("朝") || backgroundLabel.includes("午前")) return "morning";
  return "evening";
}

function chapterThreeBgm(record) {
  const sceneNumber = Number.parseInt(record.scene_id.slice(-2), 10);
  if (sceneNumber <= 2) return "BGM_CH3_DETECTIVE_OFFICE";
  if (sceneNumber <= 4) return "BGM_CH3_OBSERVATION";
  if (sceneNumber === 5) return "BGM_CH3_DETECTIVE_OFFICE";
  if (sceneNumber <= 7) return "BGM_CH3_OBSERVATION";
  if (sceneNumber === 8) return "BGM_CH3_DETECTIVE_OFFICE";
  if (sceneNumber === 9) {
    return record.sequence < 5 ? "BGM_CH3_DETECTIVE_OFFICE" : "BGM_CH3_YAMAZOE_REQUEST";
  }
  if (sceneNumber <= 11) return "BGM_CH3_YAMAZOE_REQUEST";
  if (sceneNumber === 12) {
    return record.sequence < 4 ? "BGM_CH3_YAMAZOE_REQUEST" : "BGM_CH3_CURSED_LETTER_REVEAL";
  }
  throw new Error(`CH03のBGM割当がありません: ${record.scene_id}:${record.sequence}`);
}

function normalizeRecord(record, chapterPosition, chapterRecordCount) {
  const common = {
    ...record,
    chapterPosition,
    chapterRecordCount,
    visualPeriod: "",
    hasDedicatedPeriodBackground: false,
  };

  if (record.chapter_id === "CH04") {
    return {
      ...common,
      environment: "",
      sfx: "",
      visualPeriod: record.time_cue,
    };
  }

  if (record.chapter_id === "CH03") {
    return {
      ...common,
      bgm: chapterThreeBgm(record),
      environment: "",
      sfx: "",
    };
  }

  if (record.chapter_id !== "CH02") {
    return common;
  }

  const background = chapterTwoBackground(record);
  return {
    ...common,
    background,
    bgm: Number.parseInt(record.scene_id.slice(-2), 10) <= 5
      ? "BGM_CH2_EVERYDAY_UNEASE"
      : "BGM_CH2_QUIET_ANXIETY",
    environment: chapterTwoEnvironment(record),
    sfx: "",
    visualPeriod: chapterTwoPeriod(record.background),
    hasDedicatedPeriodBackground: background === CH2_BACKGROUNDS.livingDiningEvening
      || background === CH2_BACKGROUNDS.livingDiningNight
      || background === CH2_BACKGROUNDS.entranceInteriorEvening,
  };
}

function loopingAudioVolume(kind, id) {
  if (kind === "environment" && CH2_ENVIRONMENT_VOLUME[id] !== undefined) {
    return CH2_ENVIRONMENT_VOLUME[id];
  }
  return TEMPORARY_VOLUME[kind];
}

function resolveAudio(kind, id) {
  const asset = AUDIO_ASSETS[kind]?.[id];
  if (!asset) {
    throw new Error(`未登録の${kind}素材IDです: ${id}`);
  }
  return asset;
}

function attemptPlay(audio, eventContext) {
  const promise = audio.play();
  if (promise && typeof promise.catch === "function") {
    promise.catch((error) => {
      if (error.name === "AbortError") {
        state.events.push({ type: "play-aborted-by-transition", context: eventContext });
        return;
      }
      if (error.name === "NotAllowedError") {
        state.pendingAudioResume = true;
        state.events.push({ type: "play-blocked", context: eventContext });
        return;
      }
      state.errors.push({
        type: "play-rejection",
        context: eventContext,
        name: error.name,
        message: error.message,
      });
    });
  }
}

function fadeAudioVolume(audio, targetVolume, durationMs, onComplete) {
  const token = (audioFadeTokens.get(audio) ?? 0) + 1;
  audioFadeTokens.set(audio, token);
  const startVolume = audio.volume;
  const startedAt = performance.now();

  function step(now) {
    if (audioFadeTokens.get(audio) !== token) return;
    const progress = Math.min(1, (now - startedAt) / durationMs);
    const nextVolume = startVolume + (targetVolume - startVolume) * progress;
    audio.volume = Math.min(1, Math.max(0, nextVolume));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  }

  requestAnimationFrame(step);
}

function switchLoopingAudio(kind, id) {
  const isBgm = kind === "bgm";
  const audio = isBgm ? bgmAudio : environmentAudio;
  const stateKey = isBgm ? "currentBgm" : "currentEnvironment";
  const targetVolume = loopingAudioVolume(kind, id);

  if (state[stateKey] === id) {
    state.events.push({ type: "audio-continued", kind, id, index: state.index });
    if (Math.abs(audio.volume - targetVolume) > 0.001) {
      fadeAudioVolume(audio, targetVolume, AUDIO_FADE_MS);
    }
    if (audio.paused && !state.muted) {
      attemptPlay(audio, `${kind}:${id}:resume`);
    }
    return;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.src = resolveAudio(kind, id);
  audio.load();
  audio.volume = 0;
  state[stateKey] = id;
  state.events.push({ type: "audio-switched", kind, id, index: state.index });

  if (!state.muted) {
    attemptPlay(audio, `${kind}:${id}:switch`);
    fadeAudioVolume(audio, targetVolume, AUDIO_FADE_MS);
  } else {
    audio.volume = targetVolume;
  }
}

function playSfx(id, recordKey) {
  if (state.lastSfxRecord === recordKey) {
    return;
  }

  const audio = createAudioChannel("sfx", false, TEMPORARY_VOLUME.sfx);
  audio.src = resolveAudio("sfx", id);
  audio.addEventListener("ended", () => activeSfx.delete(audio), { once: true });
  activeSfx.add(audio);
  state.lastSfxRecord = recordKey;
  state.events.push({ type: "sfx-fired", id, recordKey, index: state.index });

  if (!state.muted) {
    attemptPlay(audio, `sfx:${id}:${recordKey}`);
  }
}

function stopAllAudio(fade = false) {
  for (const audio of [bgmAudio, environmentAudio, ...activeSfx]) {
    if (fade && !audio.paused) {
      fadeAudioVolume(audio, 0, AUDIO_FADE_MS, () => {
        audio.pause();
        audio.currentTime = 0;
        if (audio === bgmAudio) audio.volume = loopingAudioVolume("bgm", state.currentBgm);
        if (audio === environmentAudio) audio.volume = loopingAudioVolume("environment", state.currentEnvironment);
      });
    } else {
      audio.pause();
    }
  }
  activeSfx.clear();
  state.events.push({ type: "audio-stopped", index: state.index });
}

function resetAudioForLoad() {
  stopAllAudio(false);
  for (const audio of [bgmAudio, environmentAudio]) {
    audioFadeTokens.set(audio, (audioFadeTokens.get(audio) ?? 0) + 1);
    audio.pause();
    audio.currentTime = 0;
  }
  state.currentBgm = "";
  state.currentEnvironment = "";
  state.lastSfxRecord = "";
  state.pendingAudioResume = false;
}

function restoreLoopingAudio(kind, id, shouldPlay) {
  const isBgm = kind === "bgm";
  const audio = isBgm ? bgmAudio : environmentAudio;
  const stateKey = isBgm ? "currentBgm" : "currentEnvironment";

  if (!id) {
    state[stateKey] = "";
    return;
  }

  audio.src = resolveAudio(kind, id);
  audio.load();
  audio.currentTime = 0;
  audio.volume = loopingAudioVolume(kind, id);
  audio.muted = state.muted;
  state[stateKey] = id;
  state.events.push({ type: "audio-restored", kind, id, shouldPlay, index: state.index });

  if (shouldPlay) {
    attemptPlay(audio, `${kind}:${id}:load`);
  }
}

function syncAudio(record) {
  if (record.bgm) {
    switchLoopingAudio("bgm", record.bgm);
  }
  if (record.environment) {
    switchLoopingAudio("environment", record.environment);
  }
  if (record.sfx) {
    playSfx(record.sfx, `${record.chapter_id}:${record.scene_id}:${record.sequence}`);
  }
}

function applyBackground(path) {
  if (!path || state.background === path) {
    return;
  }
  state.background = path;
  elements.background.classList.remove("is-visible");
  elements.background.src = path;
  requestAnimationFrame(() => elements.background.classList.add("is-visible"));
  state.events.push({ type: "background-switched", path, index: state.index });
}

function applyVisualDirection(record) {
  if (record.visualPeriod) {
    elements.novel.dataset.period = record.visualPeriod;
  } else {
    delete elements.novel.dataset.period;
  }
  elements.novel.classList.toggle("has-dedicated-period-background", record.hasDedicatedPeriodBackground);
  const direction = record.direction || "";
  const darkened = direction.includes("暗転");
  const focused = direction.includes("視線を寄せる") || direction.includes("画面寄り");
  elements.novel.classList.toggle("is-darkened", darkened);
  elements.novel.classList.toggle("is-focused", focused);
}

function updateChapterUi(record) {
  if (state.currentChapterId === record.chapter_id) return;
  const chapter = CHAPTER_BY_ID.get(record.chapter_id);
  if (!chapter) {
    throw new Error(`未登録の章です: ${record.chapter_id}`);
  }
  if (state.currentChapterId && !record.environment && state.currentEnvironment) {
    environmentAudio.pause();
    environmentAudio.currentTime = 0;
    state.currentEnvironment = "";
    state.events.push({ type: "audio-cleared", kind: "environment", index: state.index });
  }
  state.currentChapterId = chapter.id;
  elements.gameScreen.setAttribute("aria-label", `${chapter.label}ゲーム画面`);
  elements.gameScreen.querySelector(".game-header__chapter").textContent = `${chapter.label}　${chapter.title}`;
  state.events.push({ type: "chapter-entered", chapterId: chapter.id, index: state.index });
}

function calculateAutoDelay(record) {
  const textLength = [...record.text].length;
  const minimum = record.record_type === "direction"
    ? Math.max(AUTO_TIMING.minMs, AUTO_TIMING.directionMinMs)
    : AUTO_TIMING.minMs;
  return Math.min(
    AUTO_TIMING.maxMs,
    Math.max(minimum, AUTO_TIMING.baseMs + textLength * AUTO_TIMING.perCharacterMs),
  );
}

function clearAutoTimer(reason) {
  if (state.autoTimer === null) {
    return;
  }
  clearTimeout(state.autoTimer);
  state.autoTimer = null;
  state.autoDueAt = 0;
  state.events.push({ type: "auto-timer-cleared", reason, index: state.index });
}

function scheduleAutoAdvance(record) {
  clearAutoTimer("reschedule");
  if (!state.autoEnabled || !state.started || state.ended || !record || elements.documentDialog.open) {
    return;
  }

  const delayMs = calculateAutoDelay(record);
  const scheduledMs = Math.max(1, Math.round(delayMs * state.autoTimeScale));
  state.autoDueAt = performance.now() + scheduledMs;
  state.autoTimer = window.setTimeout(() => {
    state.autoTimer = null;
    state.autoDueAt = 0;
    advance("auto");
  }, scheduledMs);
  state.events.push({
    type: "auto-scheduled",
    index: state.index,
    delayMs,
    scheduledMs,
    recordKey: `${record.scene_id}:${record.sequence}`,
  });
}

function documentDisplayAsset(record) {
  if (record.chapter_id !== "CH04" || record.record_type !== "document") {
    return null;
  }

  const filename = Object.keys(DOCUMENT_DISPLAY_ASSETS).find((candidate) => (
    record.direction.includes(candidate)
  ));
  if (!filename) {
    return null;
  }

  return { filename, ...DOCUMENT_DISPLAY_ASSETS[filename] };
}

function showDocumentForRecord(record) {
  const asset = documentDisplayAsset(record);
  if (!asset) {
    return;
  }
  clearAutoTimer("document-open");
  elements.documentDialogTitle.textContent = asset.title;
  elements.documentDialogImage.src = asset.src;
  elements.documentDialogImage.alt = asset.alt;
  elements.documentDialogImage.draggable = false;
  if (!elements.documentDialog.open) {
    elements.documentDialog.showModal();
  }
  state.events.push({
    type: "document-opened",
    recordKey: `${record.chapter_id}:${record.scene_id}:${record.sequence}`,
    filename: asset.filename,
  });
}

function resumeAfterDocumentClose() {
  state.events.push({ type: "document-closed", index: state.index });
  elements.textArea.focus({ preventScroll: true });
  scheduleAutoAdvance(state.records[state.index]);
}

function updateAutoButton() {
  elements.autoButton.textContent = state.autoEnabled ? "AUTO ON" : "AUTO OFF";
  elements.autoButton.setAttribute("aria-pressed", String(state.autoEnabled));
}

function disableAuto(reason) {
  clearAutoTimer(reason);
  if (!state.autoEnabled) return;
  state.autoEnabled = false;
  updateAutoButton();
  state.events.push({ type: "auto-disabled", reason, index: state.index });
}

function toggleAuto() {
  if (!state.started || state.ended) {
    return;
  }

  state.autoEnabled = !state.autoEnabled;
  updateAutoButton();
  state.events.push({ type: "auto-toggled", enabled: state.autoEnabled, index: state.index });

  if (state.autoEnabled) {
    scheduleAutoAdvance(state.records[state.index]);
  } else {
    clearAutoTimer("auto-off");
  }
}

function showSaveFeedback(message, isError = false) {
  if (state.saveFeedbackTimer !== null) {
    clearTimeout(state.saveFeedbackTimer);
  }
  elements.saveFeedback.textContent = message;
  elements.saveFeedback.classList.toggle("is-error", isError);
  elements.saveFeedback.hidden = false;
  state.saveFeedbackTimer = window.setTimeout(() => {
    elements.saveFeedback.hidden = true;
    state.saveFeedbackTimer = null;
  }, 2600);
}

function validateSavePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("セーブデータの形式が不正です");
  }
  if (payload.version !== SAVE_FORMAT_VERSION || payload.gameDataVersion !== GAME_DATA_VERSION) {
    throw new Error("このバージョンでは読み込めないセーブデータです");
  }
  if (!Number.isInteger(payload.index) || payload.index < 0 || payload.index >= state.records.length) {
    throw new Error("セーブ位置が不正です");
  }
  if (!CHAPTER_BY_ID.has(payload.chapterId)) {
    throw new Error("セーブデータの章が不正です");
  }

  const record = state.records[payload.index];
  if (
    record.chapter_id !== payload.chapterId
    || record.scene_id !== payload.sceneId
    || record.sequence !== payload.sequence
    || record.chapterPosition !== payload.chapterPosition
  ) {
    throw new Error("セーブ位置と現在の台本が一致しません");
  }

  const knownBackgrounds = new Set(state.records.map((item) => item.background).filter(Boolean));
  if (typeof payload.background !== "string" || (payload.background && !knownBackgrounds.has(payload.background))) {
    throw new Error("セーブデータの背景が不正です");
  }
  for (const [kind, id] of [["bgm", payload.bgm], ["environment", payload.environment]]) {
    if (typeof id !== "string") {
      throw new Error(`セーブデータの${kind}指定が不正です`);
    }
    if (id) resolveAudio(kind, id);
  }
  if (
    typeof payload.bgmPlaying !== "boolean"
    || typeof payload.environmentPlaying !== "boolean"
    || typeof payload.muted !== "boolean"
    || typeof payload.autoEnabled !== "boolean"
  ) {
    throw new Error("セーブデータの状態値が不正です");
  }
  if ((payload.bgmPlaying && !payload.bgm) || (payload.environmentPlaying && !payload.environment)) {
    throw new Error("セーブデータの音声再生状態が不正です");
  }
  if (typeof payload.visualPeriod !== "string" || payload.visualPeriod !== record.visualPeriod) {
    throw new Error("セーブデータの時間帯状態が不正です");
  }
  if (!payload.progressFlags || !Array.isArray(payload.progressFlags.visitedScenes)) {
    throw new Error("セーブデータの進行情報が不正です");
  }
  const knownSceneKeys = new Set(state.records.map((item) => `${item.chapter_id}:${item.scene_id}`));
  if (
    payload.progressFlags.visitedScenes.length > knownSceneKeys.size
    || payload.progressFlags.visitedScenes.some((key) => typeof key !== "string" || !knownSceneKeys.has(key))
  ) {
    throw new Error("セーブデータの進行フラグが不正です");
  }
  if (!Number.isFinite(Date.parse(payload.savedAt))) {
    throw new Error("セーブ日時が不正です");
  }

  return { payload, record };
}

function readStoredSave() {
  try {
    const source = localStorage.getItem(SAVE_STORAGE_KEY);
    if (source === null) {
      return { status: "none" };
    }
    const parsed = JSON.parse(source);
    const validated = validateSavePayload(parsed);
    return { status: "valid", ...validated };
  } catch (error) {
    return { status: "invalid", error };
  }
}

function formatSaveSummary(payload) {
  const chapter = CHAPTER_BY_ID.get(payload.chapterId);
  const savedAt = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(payload.savedAt));
  return `${chapter.label}「${chapter.title}」 / ${payload.sceneId} / ${savedAt}`;
}

function updateSaveUi() {
  const result = readStoredSave();
  const isValid = result.status === "valid";
  const hasStoredData = result.status !== "none";
  const summary = isValid
    ? formatSaveSummary(result.payload)
    : hasStoredData
      ? "読み込めないセーブデータがあります"
      : "セーブデータはありません";

  elements.titleSaveSummary.textContent = summary;
  elements.saveDialogSummary.textContent = summary;
  elements.titleLoadButton.disabled = !hasStoredData;
  elements.confirmLoadButton.disabled = !isValid;
  elements.deleteSaveButton.disabled = !hasStoredData;
  return result;
}

function createSavePayload(autoEnabledAtSave) {
  const record = state.records[state.index];
  return {
    version: SAVE_FORMAT_VERSION,
    gameDataVersion: GAME_DATA_VERSION,
    savedAt: new Date().toISOString(),
    index: state.index,
    chapterId: record.chapter_id,
    sceneId: record.scene_id,
    sequence: record.sequence,
    chapterPosition: record.chapterPosition,
    background: state.background,
    bgm: state.currentBgm,
    environment: state.currentEnvironment,
    bgmPlaying: Boolean(state.currentBgm) && !bgmAudio.paused,
    environmentPlaying: Boolean(state.currentEnvironment) && !environmentAudio.paused,
    visualPeriod: elements.novel.dataset.period ?? "",
    muted: state.muted,
    autoEnabled: autoEnabledAtSave,
    progressFlags: {
      visitedScenes: [...state.visitedScenes],
    },
  };
}

function saveCurrentGame({ confirmOverwrite = true } = {}) {
  if (!state.started || state.ended || state.index < 0 || state.advancing) {
    showSaveFeedback("現在はセーブできません", true);
    return false;
  }

  const existing = readStoredSave();
  if (existing.status !== "none" && confirmOverwrite && !window.confirm("現在のセーブを上書きしますか？")) {
    return false;
  }

  const autoEnabledAtSave = state.autoEnabled;
  disableAuto("save");
  const payload = createSavePayload(autoEnabledAtSave);
  try {
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    updateSaveUi();
    showSaveFeedback("セーブしました");
    state.events.push({ type: "game-saved", index: state.index, chapterId: payload.chapterId });
    return true;
  } catch (error) {
    state.errors.push({ type: "save-storage-error", message: error.message });
    showSaveFeedback("セーブに失敗しました", true);
    return false;
  }
}

function openSaveDialog() {
  updateSaveUi();
  if (!elements.saveDialog.open) {
    elements.saveDialog.showModal();
  }
}

function updateSoundButton() {
  elements.soundButton.textContent = state.muted ? "音声 OFF" : "音声 ON";
  elements.soundButton.setAttribute("aria-pressed", String(state.muted));
}

function loadSavedGame({ confirmCurrent = true } = {}) {
  const result = readStoredSave();
  if (result.status !== "valid") {
    showSaveFeedback(result.status === "none" ? "セーブデータがありません" : result.error.message, true);
    updateSaveUi();
    return false;
  }
  if (state.started && !state.ended && confirmCurrent && !window.confirm("現在の進行を破棄してロードしますか？")) {
    return false;
  }

  const { payload, record } = result;
  disableAuto("load");
  resetAudioForLoad();
  state.started = true;
  state.ended = false;
  state.advancing = false;
  state.advanceLockUntil = performance.now() + ADVANCE_LOCK_MS;
  state.currentChapterId = "";
  state.background = "";
  state.muted = payload.muted;
  state.processedRecordKeys = new Set();
  state.visitedScenes = new Set(payload.progressFlags.visitedScenes);
  state.lastSfxRecord = `${record.chapter_id}:${record.scene_id}:${record.sequence}`;
  bgmAudio.muted = state.muted;
  environmentAudio.muted = state.muted;
  updateSoundButton();

  elements.titleScreen.hidden = true;
  elements.endScreen.hidden = true;
  elements.fatalError.hidden = true;
  elements.gameScreen.hidden = false;
  if (elements.saveDialog.open) elements.saveDialog.close();

  renderRecord(payload.index, { syncSound: false });
  if (payload.background !== state.background) {
    applyBackground(payload.background);
  }
  restoreLoopingAudio("bgm", payload.bgm, payload.bgmPlaying);
  restoreLoopingAudio("environment", payload.environment, payload.environmentPlaying);
  state.autoEnabled = false;
  updateAutoButton();
  elements.textArea.focus({ preventScroll: true });
  showSaveFeedback("ロードしました");
  state.events.push({ type: "game-loaded", index: state.index, chapterId: payload.chapterId });
  return true;
}

function deleteSaveData({ confirmDelete = true } = {}) {
  try {
    const hasStoredData = localStorage.getItem(SAVE_STORAGE_KEY) !== null;
    if (!hasStoredData) {
      updateSaveUi();
      return false;
    }
    if (confirmDelete && !window.confirm("セーブデータを削除しますか？")) {
      return false;
    }
    localStorage.removeItem(SAVE_STORAGE_KEY);
    updateSaveUi();
    showSaveFeedback("セーブデータを削除しました");
    state.events.push({ type: "save-deleted", index: state.index });
    return true;
  } catch (error) {
    state.errors.push({ type: "save-delete-error", message: error.message });
    showSaveFeedback("セーブデータを削除できませんでした", true);
    return false;
  }
}

function renderRecord(index, { syncSound = true } = {}) {
  const record = state.records[index];
  if (!record) {
    throw new Error(`表示対象レコードがありません: ${index}`);
  }

  state.index = index;
  const recordKey = `${record.chapter_id}:${record.scene_id}:${record.sequence}`;
  state.processedRecordKeys.add(recordKey);
  state.visitedScenes.add(`${record.chapter_id}:${record.scene_id}`);

  updateChapterUi(record);
  applyBackground(record.background);
  applyVisualDirection(record);
  if (syncSound) {
    syncAudio(record);
  }

  elements.sceneLabel.textContent = `${record.scene_id}　${record.subsection}`;
  elements.storyText.textContent = record.text;
  elements.recordPosition.textContent = `${String(record.chapterPosition).padStart(3, "0")} / ${record.chapterRecordCount}`;
  elements.textArea.classList.toggle("is-direction", record.record_type === "direction");
  elements.textArea.dataset.recordType = record.record_type;
  elements.textArea.dataset.direction = record.direction;
  elements.textArea.dataset.audioDirection = record.audio_direction;
  elements.textArea.dataset.deliveryMode = record.delivery_mode;
  elements.textArea.dataset.timeCue = record.time_cue;

  if (record.record_type === "dialogue" && record.speaker) {
    elements.speaker.textContent = record.speaker;
    elements.speaker.hidden = false;
  } else {
    elements.speaker.textContent = "";
    elements.speaker.hidden = true;
  }

  state.events.push({ type: "record-rendered", recordKey, index });
  showDocumentForRecord(record);
  scheduleAutoAdvance(record);
}

function advance(source = "manual") {
  if (!state.started || state.ended || state.advancing || elements.documentDialog.open) {
    return false;
  }

  const now = performance.now();
  if (now < state.advanceLockUntil) {
    state.events.push({ type: "advance-blocked", source, index: state.index });
    if (source === "auto" && state.autoEnabled) {
      scheduleAutoAdvance(state.records[state.index]);
    }
    return false;
  }

  clearAutoTimer(`${source}-advance`);
  state.advancing = true;
  state.advanceLockUntil = now + ADVANCE_LOCK_MS;
  state.events.push({ type: "advance-accepted", source, index: state.index });
  try {
    if (state.index >= state.records.length - 1) {
      endChapter();
      return true;
    }
    renderRecord(state.index + 1);
    return true;
  } catch (error) {
    showFatalError(error);
    return false;
  } finally {
    state.advancing = false;
  }
}

function startGame() {
  if (state.started || state.records.length === 0) {
    return;
  }
  state.started = true;
  elements.titleScreen.hidden = true;
  elements.gameScreen.hidden = false;
  renderRecord(0);
  elements.textArea.focus({ preventScroll: true });
}

function endChapter() {
  if (state.ended) {
    return;
  }
  clearAutoTimer("chapter-end");
  state.autoEnabled = false;
  updateAutoButton();
  state.ended = true;
  const chapter = CHAPTER_BY_ID.get(state.currentChapterId);
  elements.endTitle.textContent = chapter?.endTitle ?? "章終了";
  stopAllAudio(true);
  elements.gameScreen.hidden = true;
  elements.endScreen.hidden = false;
  state.events.push({ type: "chapter-ended", index: state.index });
}

function toggleSound() {
  state.muted = !state.muted;
  bgmAudio.muted = state.muted;
  environmentAudio.muted = state.muted;
  for (const audio of activeSfx) {
    audio.muted = state.muted;
  }
  updateSoundButton();

  if (!state.muted && state.started && !state.ended) {
    state.pendingAudioResume = false;
    if (state.currentBgm) attemptPlay(bgmAudio, "bgm:unmute");
    if (state.currentEnvironment) attemptPlay(environmentAudio, "environment:unmute");
  }
}

function preloadBackgrounds(records) {
  const paths = [...new Set(records.map((record) => record.background).filter(Boolean))];
  return Promise.all(paths.map((path) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(path);
    image.onerror = () => reject(new Error(`背景画像を読み込めません: ${path}`));
    image.src = path;
  })));
}

function validateAudioReferences(records) {
  for (const record of records) {
    if (record.bgm) resolveAudio("bgm", record.bgm);
    if (record.environment) resolveAudio("environment", record.environment);
    if (record.sfx) resolveAudio("sfx", record.sfx);
  }
}

function showFatalError(error) {
  state.errors.push({ type: "fatal", message: error.message });
  clearAutoTimer("fatal-error");
  state.autoEnabled = false;
  updateAutoButton();
  stopAllAudio();
  elements.titleScreen.hidden = true;
  elements.gameScreen.hidden = true;
  elements.endScreen.hidden = true;
  elements.fatalErrorMessage.textContent = error.message;
  elements.fatalError.hidden = false;
}

async function loadGame() {
  try {
    const loadedChapters = await Promise.all(CHAPTERS.map(async (chapter) => {
      const response = await fetch(chapter.scenarioUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`${chapter.label}台本CSVを読み込めません: HTTP ${response.status}`);
      }
      const source = await response.text();
      const records = recordsFromCsv(source);
      const summary = validateChapter(records, chapter.specification);
      return {
        chapter,
        summary,
        records: records.map((record, index) => normalizeRecord(record, index + 1, records.length)),
      };
    }));

    state.summaries = Object.fromEntries(loadedChapters.map(({ chapter, summary }) => [chapter.id, summary]));
    state.records = loadedChapters.flatMap(({ records }) => records);
    validateAudioReferences(state.records);
    await preloadBackgrounds(state.records);
    elements.loadingStatus.textContent = "準備ができました";
    elements.startButton.disabled = false;
    updateSaveUi();
    state.events.push({
      type: "game-ready",
      recordCount: state.records.length,
      chapterRecordCounts: Object.fromEntries(loadedChapters.map(({ chapter, records }) => [chapter.id, records.length])),
    });
  } catch (error) {
    showFatalError(error);
  }
}

enableMaterialProtection(elements.novel);

elements.startButton.addEventListener("click", startGame);
elements.titleLoadButton.addEventListener("click", openSaveDialog);
elements.autoButton.addEventListener("click", toggleAuto);
elements.saveButton.addEventListener("click", () => saveCurrentGame());
elements.loadButton.addEventListener("click", openSaveDialog);
elements.soundButton.addEventListener("click", toggleSound);
elements.confirmLoadButton.addEventListener("click", () => loadSavedGame());
elements.deleteSaveButton.addEventListener("click", () => deleteSaveData());
elements.closeSaveDialogButton.addEventListener("click", () => elements.saveDialog.close());
elements.closeDocumentDialogButton.addEventListener("click", () => elements.documentDialog.close());
elements.documentDialog.addEventListener("close", resumeAfterDocumentClose);
elements.textArea.addEventListener("click", () => advance("click"));
document.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && state.started && !state.ended) {
    if (event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
    advance("keyboard");
  }
});

function getSaveDebugSnapshot() {
  const result = readStoredSave();
  if (result.status === "valid") {
    return { status: result.status, payload: structuredClone(result.payload) };
  }
  return { status: result.status, message: result.error?.message ?? "" };
}

if (new URLSearchParams(window.location.search).has("debug")) {
  const debugApi = Object.freeze({
    getSnapshot: () => ({
      ready: Object.keys(state.summaries).length === CHAPTERS.length,
      started: state.started,
      ended: state.ended,
      currentChapterId: state.currentChapterId,
      autoEnabled: state.autoEnabled,
      autoTimerActive: state.autoTimer !== null,
      autoDueInMs: state.autoTimer === null ? 0 : Math.max(0, Math.round(state.autoDueAt - performance.now())),
      autoTiming: AUTO_TIMING,
      index: state.index,
      recordCount: state.records.length,
      chapterSummaries: structuredClone(state.summaries),
      processedCount: state.processedRecordKeys.size,
      processedRecordKeys: [...state.processedRecordKeys],
      visitedScenes: [...state.visitedScenes],
      currentBgm: state.currentBgm,
      currentEnvironment: state.currentEnvironment,
      currentBackground: state.background,
      currentPeriod: elements.novel.dataset.period ?? "",
      save: getSaveDebugSnapshot(),
      saveStorageKey: SAVE_STORAGE_KEY,
      displayedText: elements.storyText.textContent,
      displayedRecordPosition: elements.recordPosition.textContent,
      documentDialogOpen: elements.documentDialog.open,
      documentImageSrc: elements.documentDialogImage.getAttribute("src"),
      bgm: {
        src: bgmAudio.getAttribute("src"),
        loop: bgmAudio.loop,
        volume: bgmAudio.volume,
        paused: bgmAudio.paused,
      },
      environment: {
        src: environmentAudio.getAttribute("src"),
        loop: environmentAudio.loop,
        volume: environmentAudio.volume,
        paused: environmentAudio.paused,
      },
      activeSfxCount: activeSfx.size,
      loopingAudioInstanceCount: 2,
      lastSfxRecord: state.lastSfxRecord,
      events: [...state.events],
      errors: [...state.errors],
    }),
    audioAssets: AUDIO_ASSETS,
    saveCurrent: () => saveCurrentGame({ confirmOverwrite: false }),
    loadSaved: () => loadSavedGame({ confirmCurrent: false }),
    deleteSave: () => deleteSaveData({ confirmDelete: false }),
    getSave: () => getSaveDebugSnapshot(),
    jumpTo: (chapterId, sceneId, sequence = 1) => {
      const targetIndex = state.records.findIndex((record) => (
        record.chapter_id === chapterId
        && record.scene_id === sceneId
        && record.sequence === sequence
      ));
      if (targetIndex < 0) {
        throw new Error(`ジャンプ先がありません: ${chapterId}:${sceneId}:${sequence}`);
      }
      clearAutoTimer("debug-jump");
      state.started = true;
      state.ended = false;
      state.advanceLockUntil = 0;
      elements.titleScreen.hidden = true;
      elements.endScreen.hidden = true;
      elements.fatalError.hidden = true;
      elements.gameScreen.hidden = false;
      renderRecord(targetIndex);
      elements.textArea.focus({ preventScroll: true });
    },
    advance: () => {
      state.advanceLockUntil = 0;
      return advance("debug");
    },
    setAutoTimeScale: (scale) => {
      if (!Number.isFinite(scale) || scale <= 0 || scale > 1) {
        throw new Error("AUTOテスト倍率は0より大きく1以下で指定してください");
      }
      state.autoTimeScale = scale;
      if (state.autoEnabled) {
        scheduleAutoAdvance(state.records[state.index]);
      }
    },
  });
  window.__cursedLetterDebug = debugApi;
  window.__chapter1Debug = debugApi;
}

loadGame();
