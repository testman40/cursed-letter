export const REQUIRED_COLUMNS = [
  "chapter_id",
  "scene_id",
  "subsection",
  "sequence",
  "record_type",
  "speaker",
  "delivery_mode",
  "text",
  "background",
  "environment",
  "bgm",
  "sfx",
  "time_cue",
  "direction",
  "audio_direction",
];

export function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("CSVの引用符が閉じられていません。");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  return rows;
}

export function recordsFromCsv(source) {
  const rows = parseCsv(source);
  if (rows.length < 2) {
    throw new Error("CSVに表示レコードがありません。");
  }

  const header = rows[0];
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !header.includes(column));
  if (missingColumns.length > 0) {
    throw new Error(`CSVの必須列が不足しています: ${missingColumns.join(", ")}`);
  }

  return rows.slice(1).filter((row) => row.some(Boolean)).map((row, rowIndex) => {
    if (row.length !== header.length) {
      throw new Error(`CSV ${rowIndex + 2}行目の列数が不正です。`);
    }

    const record = Object.fromEntries(header.map((column, index) => [column, row[index]]));
    const sequence = Number.parseInt(record.sequence, 10);
    if (!Number.isInteger(sequence)) {
      throw new Error(`CSV ${rowIndex + 2}行目のsequenceが不正です。`);
    }

    return { ...record, sequence };
  });
}

export function validateChapter(records, specification = {}) {
  const errors = [];
  const expectedTypes = new Set(["dialogue", "narration", "direction", "document"]);
  const sceneMap = new Map();
  const {
    chapterId = "CH01",
    recordCount = 146,
    scenes: expectedScenes = ["Scene01", "Scene02", "Scene03", "Scene04", "Scene05", "Scene06", "Scene07"],
    typeCounts: expectedTypeCounts = { dialogue: 96, narration: 42, direction: 8 },
  } = specification;

  if (records.length !== recordCount) {
    errors.push(`${chapterId}のレコード数が${recordCount}件ではありません: ${records.length}`);
  }

  for (const record of records) {
    if (record.chapter_id !== chapterId) {
      errors.push(`chapter_idが不正です: ${record.chapter_id}`);
    }
    if (!expectedTypes.has(record.record_type)) {
      errors.push(`未対応record_type: ${record.record_type}`);
    }
    if (!sceneMap.has(record.scene_id)) {
      sceneMap.set(record.scene_id, []);
    }
    sceneMap.get(record.scene_id).push(record.sequence);
  }

  const scenes = [...sceneMap.keys()];
  if (JSON.stringify(scenes) !== JSON.stringify(expectedScenes)) {
    errors.push(`Scene順が不正です: ${scenes.join(", ")}`);
  }

  for (const [sceneId, sequences] of sceneMap.entries()) {
    sequences.forEach((sequence, index) => {
      if (sequence !== index + 1) {
        errors.push(`${sceneId}のsequenceに欠番または重複があります: ${sequence}`);
      }
    });
  }

  const typeCounts = records.reduce((counts, record) => {
    counts[record.record_type] = (counts[record.record_type] ?? 0) + 1;
    return counts;
  }, {});

  if (Object.entries(expectedTypeCounts).some(([type, count]) => typeCounts[type] !== count)) {
    errors.push(`record_type件数が不正です: ${JSON.stringify(typeCounts)}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return {
    recordCount: records.length,
    scenes,
    typeCounts,
  };
}
