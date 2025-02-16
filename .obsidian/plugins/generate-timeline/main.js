/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TimelinePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/TimelineView.ts
var import_obsidian2 = require("obsidian");

// src/Timeline.ts
var import_obsidian = require("obsidian");
var Timeline = class {
  constructor(app, settings) {
    __publicField(this, "app");
    __publicField(this, "settings");
    this.app = app;
    this.settings = settings;
  }
  async getFilePreview(file) {
    const content = await this.app.vault.cachedRead(file);
    const previewContent = content.replace(/^---[\s\S]*?---/, "").trim();
    return previewContent.slice(0, 100) + (previewContent.length > 100 ? "..." : "");
  }
  async createTimelineItem(file) {
    var _a;
    const metadata = this.app.metadataCache.getFileCache(file);
    const dateValue = (_a = metadata == null ? void 0 : metadata.frontmatter) == null ? void 0 : _a[this.settings.dateAttribute];
    if (dateValue) {
      return {
        date: new Date(dateValue),
        title: file.basename,
        path: file.path,
        preview: await this.getFilePreview(file)
      };
    }
    return null;
  }
  sortItemsByDate(items) {
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  async generateFromFolder(folder) {
    if (folder.path === "timelines") {
      return [];
    }
    const timelineItems = [];
    const processFolder = async (currentFolder) => {
      var _a;
      for (const item of currentFolder.children) {
        if (item instanceof import_obsidian.TFile && item.extension === "md") {
          const metadata = this.app.metadataCache.getFileCache(item);
          const dateValue = (_a = metadata == null ? void 0 : metadata.frontmatter) == null ? void 0 : _a[this.settings.dateAttribute];
          if (dateValue) {
            timelineItems.push({
              date: new Date(dateValue),
              title: item.basename,
              path: item.path,
              preview: await this.getFilePreview(item)
            });
          }
        } else if (item instanceof import_obsidian.TFolder && item.path !== "timelines") {
          await processFolder(item);
        }
      }
    };
    await processFolder(folder);
    return timelineItems.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  async generateFromTag(tag) {
    var _a;
    const allFiles = this.app.vault.getMarkdownFiles();
    const items = [];
    const normalizedTag = tag.replace(/^#/, "");
    for (const file of allFiles) {
      const cache = this.app.metadataCache.getFileCache(file);
      if (!cache)
        continue;
      const hasMatchingTag = cache.tags && cache.tags.some((tagObj) => {
        const fileTag = tagObj.tag.replace(/^#/, "");
        return fileTag === normalizedTag || // 完全匹配
        fileTag.startsWith(normalizedTag + "/");
      }) || ((_a = cache.frontmatter) == null ? void 0 : _a.tags) && Array.isArray(cache.frontmatter.tags) && cache.frontmatter.tags.some((frontmatterTag) => {
        if (typeof frontmatterTag !== "string")
          return false;
        const fileTag = frontmatterTag.replace(/^#/, "");
        return fileTag === normalizedTag || // 完全匹配
        fileTag.startsWith(normalizedTag + "/");
      });
      if (hasMatchingTag) {
        const item = await this.createTimelineItem(file);
        if (item) {
          items.push(item);
        }
      }
    }
    return this.sortItemsByDate(items);
  }
  async generateTimelineMarkdown(items, title, source) {
    let markdown = `---
generated_from: ${source.type}:${source.value}
---

`;
    markdown += `# ${title}

`;
    let currentYear = null;
    let currentMonth = null;
    for (const item of items) {
      const date = item.date;
      const year = date.getFullYear();
      const month = date.getMonth();
      if (currentYear !== year) {
        markdown += `
## ${year}

`;
        currentYear = year;
        currentMonth = null;
      }
      if (currentMonth !== month) {
        markdown += `
### ${date.toLocaleString("default", { month: "long" })}

`;
        currentMonth = month;
      }
      markdown += `#### ${date.toLocaleDateString("zh-CN")} - [[${item.title}]]

`;
    }
    return markdown;
  }
};

// src/TimelineView.ts
var VIEW_TYPE_TIMELINE = "timeline-view";
var CLASS_TIMELINE_HEADER = "timeline-header";
var CLASS_TIMELINE_CONTAINER = "timeline-container";
var CLASS_TIMELINE_LINE = "timeline-line";
var CLASS_TIMELINE_ERA = "timeline-era";
var CLASS_TIMELINE_ERA_TITLE = "timeline-era-title";
var CLASS_TIMELINE_ITEM = "timeline-item";
var CLASS_TIMELINE_CARD = "timeline-card";
var CLASS_TIMELINE_DATE = "timeline-date";
var CLASS_TIMELINE_TITLE = "timeline-title";
var CLASS_TIMELINE_PREVIEW = "timeline-preview";
var TimelineView = class extends import_obsidian2.ItemView {
  constructor(leaf, settings) {
    super(leaf);
    __publicField(this, "timeline");
    __publicField(this, "settings");
    __publicField(this, "items", []);
    __publicField(this, "currentTitle", "");
    this.timeline = new Timeline(this.app, settings);
  }
  getViewType() {
    return VIEW_TYPE_TIMELINE;
  }
  getDisplayText() {
    return "\u65F6\u95F4\u8F74\u89C6\u56FE";
  }
  async onOpen() {
    try {
      await this.render();
    } catch (error) {
      new import_obsidian2.Notice("\u65F6\u95F4\u8F74\u89C6\u56FE\u6E32\u67D3\u5931\u8D25");
    }
  }
  renderTitle(container) {
    const titleContainer = container.createEl("div", { cls: CLASS_TIMELINE_HEADER });
    titleContainer.createEl("h2", { text: this.currentTitle });
  }
  groupItemsByYear() {
    const itemsByYear = /* @__PURE__ */ new Map();
    this.items.forEach((item) => {
      var _a;
      const year = item.date.getFullYear();
      if (!itemsByYear.has(year)) {
        itemsByYear.set(year, []);
      }
      (_a = itemsByYear.get(year)) == null ? void 0 : _a.push(item);
    });
    return itemsByYear;
  }
  renderItem(container, item, index, itemsLength) {
    const itemEl = container.createEl("div", {
      cls: `${CLASS_TIMELINE_ITEM}${this.getItemClasses(index, itemsLength)}`
    });
    const card = itemEl.createEl("div", { cls: CLASS_TIMELINE_CARD });
    card.createEl("div", {
      cls: CLASS_TIMELINE_DATE,
      text: item.date.toLocaleDateString("zh-CN")
    });
    const titleEl = card.createEl("div", { cls: CLASS_TIMELINE_TITLE });
    titleEl.textContent = item.title;
    if (item.preview) {
      const previewEl = card.createEl("div", { cls: CLASS_TIMELINE_PREVIEW });
      previewEl.textContent = item.preview;
    }
    titleEl.addEventListener("click", async () => {
      const file = this.app.vault.getAbstractFileByPath(item.path);
      if (file instanceof import_obsidian2.TFile) {
        await this.app.workspace.getLeaf().openFile(file);
      }
    });
  }
  getItemClasses(index, itemsLength) {
    return (index === 0 ? " first-item" : "") + (index === itemsLength - 1 ? " last-item" : "");
  }
  renderEra(container, year, items) {
    const era = container.createEl("div", { cls: CLASS_TIMELINE_ERA });
    era.createEl("div", { cls: CLASS_TIMELINE_ERA_TITLE, text: `${year}` });
    items.forEach((item, index) => this.renderItem(era, item, index, items.length));
  }
  async render() {
    const container = this.containerEl.children[1];
    container.empty();
    if (this.currentTitle) {
      this.renderTitle(container);
    }
    const timelineContainer = container.createEl("div", { cls: CLASS_TIMELINE_CONTAINER });
    timelineContainer.createEl("div", { cls: CLASS_TIMELINE_LINE });
    const itemsByYear = this.groupItemsByYear();
    Array.from(itemsByYear.entries()).sort(([yearA], [yearB]) => yearB - yearA).forEach(([year, items]) => this.renderEra(timelineContainer, year, items));
  }
  async updateFromFolder(folderPath) {
    const folder = this.app.vault.getAbstractFileByPath(folderPath);
    if (folder) {
      this.currentTitle = `\u{1F4C2} ${folder.name}`;
      this.items = await this.timeline.generateFromFolder(folder);
      await this.render();
    }
  }
  async updateFromTag(tag) {
    try {
      this.currentTitle = `\u{1F3F7}\uFE0F ${tag}`;
      this.items = await this.timeline.generateFromTag(tag);
      if (this.items.length === 0) {
        new import_obsidian2.Notice(`\u6CA1\u6709\u627E\u5230\u5305\u542B\u6807\u7B7E #${tag} \u53CA\u5176\u5B50\u6807\u7B7E\u7684\u6587\u4EF6`);
        return;
      }
      await this.render();
    } catch (error) {
      new import_obsidian2.Notice("\u751F\u6210\u65F6\u95F4\u8F74\u5931\u8D25");
      throw error;
    }
  }
  getIcon() {
    return "history";
  }
};

// src/FolderSuggest.ts
var import_obsidian3 = require("obsidian");
var FolderSuggestModal = class extends import_obsidian3.FuzzySuggestModal {
  constructor(app) {
    super(app);
    __publicField(this, "resolve");
    this.setPlaceholder("\u9009\u62E9\u4E00\u4E2A\u6587\u4EF6\u5939");
  }
  getItems() {
    const folders = [];
    const pushFolder = (folder) => {
      folders.push(folder);
      folder.children.filter((child) => child instanceof import_obsidian3.TFolder).forEach(pushFolder);
    };
    const rootFolder = this.app.vault.getRoot();
    pushFolder(rootFolder);
    return folders;
  }
  getItemText(folder) {
    return folder.path;
  }
  onChooseItem(folder) {
    this.resolve(folder.path);
    this.close();
  }
  async openAndGetValue() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    }).then((value) => {
      if (value === void 0) {
        return null;
      }
      return value;
    });
  }
};

// src/TagSuggest.ts
var import_obsidian4 = require("obsidian");
var TagSuggestModal = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app) {
    super(app);
    __publicField(this, "resolve");
    this.setPlaceholder("\u9009\u62E9\u4E00\u4E2A\u6807\u7B7E");
  }
  getItems() {
    const tags = /* @__PURE__ */ new Set();
    const files = this.app.vault.getMarkdownFiles();
    files.forEach((file) => {
      var _a, _b;
      const cache = this.app.metadataCache.getFileCache(file);
      (_a = cache == null ? void 0 : cache.tags) == null ? void 0 : _a.forEach((tag) => {
        tags.add(tag.tag.replace("#", ""));
      });
      const frontmatterTags = (_b = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _b.tags;
      if (Array.isArray(frontmatterTags)) {
        frontmatterTags.forEach((tag) => {
          tags.add(tag.replace("#", ""));
        });
      } else if (typeof frontmatterTags === "string") {
        frontmatterTags.split("-").forEach((tag) => {
          tags.add(tag.trim().replace("#", ""));
        });
      }
    });
    const tagArray = Array.from(tags);
    console.log("\u53EF\u7528\u7684\u6807\u7B7E:", tagArray);
    return tagArray;
  }
  getItemText(tag) {
    return tag;
  }
  onChooseItem(tag) {
    console.log("\u9009\u62E9\u7684\u6807\u7B7E:", tag);
    this.resolve(tag);
    this.close();
  }
  async openAndGetValue() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
  }
};

// src/TimelineSettings.ts
function getCssVariable(name) {
  return `var(${name})`;
}
var DEFAULT_SETTINGS = {
  lineWidth: 2,
  lineColor: getCssVariable("--interactive-accent"),
  itemSpacing: 30,
  cardBackground: getCssVariable("--background-primary-alt"),
  animationDuration: 200,
  dateAttribute: "created",
  // 默认使用 frontmatter 中的 date 属性作为时间轴排序依据
  fileNamePrefix: "",
  fileNameSuffix: "",
  defaultPosition: "right"
  // 新增：默认在右侧边栏
};

// src/main.ts
var import_obsidian6 = require("obsidian");
var TimelinePlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings");
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new TimelineSettingTab(this.app, this));
    console.log("\u52A0\u8F7D Timeline \u63D2\u4EF6");
    try {
      this.registerView(
        VIEW_TYPE_TIMELINE,
        (leaf) => new TimelineView(leaf, this.settings)
      );
      this.registerEvent(
        this.app.workspace.on("file-menu", (menu, abstractFile) => {
          var _a;
          if (abstractFile instanceof import_obsidian5.TFile && abstractFile.path.startsWith("timelines/") && abstractFile.extension === "md") {
            const cache = this.app.metadataCache.getFileCache(abstractFile);
            const generatedFrom = (_a = cache == null ? void 0 : cache.frontmatter) == null ? void 0 : _a.generated_from;
            if (generatedFrom) {
              const [type, value] = generatedFrom.split(":");
              menu.addItem((item) => {
                item.setTitle("\u6253\u5F00\u65F6\u95F4\u8F74\u89C6\u56FE").setIcon("clock").onClick(async () => {
                  await this.activateView(this.settings.defaultPosition);
                  const view = this.getTimelineView();
                  if (view) {
                    if (type === "folder") {
                      await view.updateFromFolder(value);
                    } else if (type === "tag") {
                      await view.updateFromTag(value);
                    }
                  }
                });
              });
            }
          }
        })
      );
      this.addCommand({
        id: "generate-timeline-view-from-folder",
        name: "\u4ECE\u6587\u4EF6\u5939\u751F\u6210\u65F6\u95F4\u8F74\u89C6\u56FE",
        callback: async () => {
          try {
            const folderPath = await this.selectFolder();
            if (folderPath) {
              await this.activateView(this.settings.defaultPosition);
              const view = this.getTimelineView();
              if (view) {
                await view.updateFromFolder(folderPath);
              }
            }
          } catch (error) {
            console.error("\u751F\u6210\u6587\u4EF6\u5939\u65F6\u95F4\u8F74\u89C6\u56FE\u65F6\u51FA\u9519:", error);
          }
        }
      });
      this.addCommand({
        id: "generate-timeline-file-from-folder",
        name: "\u4ECE\u6587\u4EF6\u5939\u751F\u6210\u65F6\u95F4\u8F74\u6587\u4EF6",
        callback: async () => {
          try {
            const folderPath = await this.selectFolder();
            if (folderPath) {
              const folder = this.app.vault.getAbstractFileByPath(folderPath);
              if (!(folder instanceof import_obsidian6.TFolder)) {
                throw new Error(`Invalid folder path: ${folderPath}`);
              }
              const timeline = new Timeline(this.app, this.settings);
              const items = await timeline.generateFromFolder(folder);
              const content = await timeline.generateTimelineMarkdown(items, `Timeline - ${folderPath}`, { type: "folder", value: folderPath });
              const { folderPath: targetFolder, fileName } = await this.createNestedFolders(folderPath);
              const finalFileName = this.generateFileName(fileName || folderPath.split("/").pop() || "");
              const filePath = `${targetFolder}/${finalFileName}.md`;
              const existingFile = this.app.vault.getAbstractFileByPath(filePath);
              if (existingFile) {
                await this.app.vault.delete(existingFile);
              }
              const file = await this.app.vault.create(filePath, content);
              await this.app.workspace.getLeaf().openFile(file);
            }
          } catch (error) {
            console.error("\u751F\u6210\u6587\u4EF6\u5939\u65F6\u95F4\u8F74\u6587\u4EF6\u65F6\u51FA\u9519:", error);
          }
        }
      });
      this.addCommand({
        id: "generate-timeline-view-from-tag",
        name: "\u4ECE\u6807\u7B7E\u751F\u6210\u65F6\u95F4\u8F74\u89C6\u56FE",
        callback: async () => {
          try {
            const tag = await this.selectTag();
            if (tag) {
              await this.activateView(this.settings.defaultPosition);
              const view = this.getTimelineView();
              if (view) {
                await view.updateFromTag(tag);
              }
            }
          } catch (error) {
            console.error("\u751F\u6210\u6807\u7B7E\u65F6\u95F4\u8F74\u89C6\u56FE\u65F6\u51FA\u9519:", error);
          }
        }
      });
      this.addCommand({
        id: "generate-timeline-file-from-tag",
        name: "\u4ECE\u6807\u7B7E\u751F\u6210\u65F6\u95F4\u8F74\u6587\u4EF6",
        callback: async () => {
          try {
            const tag = await this.selectTag();
            if (tag) {
              await this.generateTimelineFileFromTag(tag);
            }
          } catch (error) {
            console.error("\u751F\u6210\u6807\u7B7E\u65F6\u95F4\u8F74\u6587\u4EF6\u65F6\u51FA\u9519:", error);
          }
        }
      });
    } catch (error) {
      console.error("\u63D2\u4EF6\u52A0\u8F7D\u65F6\u51FA\u9519:", error);
    }
  }
  async selectFolder() {
    const modal = new FolderSuggestModal(this.app);
    return await modal.openAndGetValue();
  }
  async selectTag() {
    const modal = new TagSuggestModal(this.app);
    return await modal.openAndGetValue();
  }
  async activateView(position = this.settings.defaultPosition) {
    const { workspace } = this.app;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_TIMELINE);
    for (const leaf of leaves) {
      await leaf.detach();
    }
    const newLeaf = position === "left" ? workspace.getLeftLeaf(false) : workspace.getRightLeaf(false);
    if (!newLeaf) {
      new import_obsidian5.Notice("\u65E0\u6CD5\u521B\u5EFA\u65F6\u95F4\u8F74\u89C6\u56FE\uFF1A\u8BF7\u68C0\u67E5\u4FA7\u8FB9\u680F\u7A7A\u95F4");
      return null;
    }
    await newLeaf.setViewState({ type: VIEW_TYPE_TIMELINE });
    workspace.revealLeaf(newLeaf);
    return newLeaf;
  }
  getTimelineView() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_TIMELINE);
    if (leaves.length === 0) {
      return null;
    }
    return leaves[0].view;
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.updateStyles();
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.updateStyles();
  }
  updateStyles() {
    var _a;
    const style = document.createElement("style");
    style.id = "timeline-custom-styles";
    style.textContent = `
			.timeline-line {
				width: ${this.settings.lineWidth}px !important;
				background: ${this.settings.lineColor} !important;
			}
			
			.timeline-item::after {
				background: ${this.settings.lineColor} !important;
			}
			
			.timeline-item {
				margin: ${this.settings.itemSpacing}px 0 !important;
			}
			
			.timeline-card {
				background: ${this.settings.cardBackground} !important;
				transition: transform ${this.settings.animationDuration}ms !important;
			}
		`;
    (_a = document.getElementById("timeline-custom-styles")) == null ? void 0 : _a.remove();
    document.head.appendChild(style);
  }
  async createNestedFolders(tagPath) {
    const rootPath = "timelines";
    if (!this.app.vault.getAbstractFileByPath(rootPath)) {
      try {
        await this.app.vault.createFolder(rootPath);
      } catch (error) {
        new import_obsidian5.Notice(`\u521B\u5EFA\u6839\u76EE\u5F55\u5931\u8D25: ${rootPath}`);
        throw error;
      }
    }
    const parts = tagPath.split("/");
    const fileName = parts.pop();
    let currentPath = rootPath;
    for (const part of parts) {
      currentPath = (0, import_obsidian5.normalizePath)(`${currentPath}/${part}`);
      const folder = this.app.vault.getAbstractFileByPath(currentPath);
      if (!folder) {
        try {
          await this.app.vault.createFolder(currentPath);
        } catch (error) {
          new import_obsidian5.Notice(`\u521B\u5EFA\u6587\u4EF6\u5939\u5931\u8D25: ${currentPath}`);
          throw error;
        }
      }
    }
    return { folderPath: currentPath, fileName };
  }
  generateFileName(baseName) {
    const prefix = this.settings.fileNamePrefix || "";
    const suffix = this.settings.fileNameSuffix || "";
    return `${prefix}${baseName}${suffix}`;
  }
  async generateTimelineFileFromTag(tag) {
    try {
      const tagPath = tag.replace("#", "");
      const { folderPath, fileName } = await this.createNestedFolders(tagPath);
      const finalFileName = this.generateFileName(fileName || "");
      const filePath = `${folderPath}/${finalFileName}.md`;
      const existingFile = this.app.vault.getAbstractFileByPath(filePath);
      if (existingFile) {
        await this.app.vault.delete(existingFile);
      }
      const timeline = new Timeline(this.app, this.settings);
      const items = await timeline.generateFromTag(tag);
      const content = await timeline.generateTimelineMarkdown(items, `Timeline - ${tag}`, { type: "tag", value: tag });
      const file = await this.app.vault.create(filePath, content);
      await this.app.workspace.getLeaf().openFile(file);
    } catch (error) {
      console.error("\u751F\u6210\u6807\u7B7E\u65F6\u95F4\u8F74\u6587\u4EF6\u65F6\u51FA\u9519:", error);
      throw error;
    }
  }
};
var TimelineSettingTab = class extends import_obsidian5.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    __publicField(this, "plugin");
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u65F6\u95F4\u8F74\u8BBE\u7F6E" });
    new import_obsidian5.Setting(containerEl).setName("\u91CD\u7F6E\u8BBE\u7F6E").setDesc("\u5C06\u6240\u6709\u8BBE\u7F6E\u6062\u590D\u4E3A\u9ED8\u8BA4\u503C").addButton((button) => button.setButtonText("\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u503C").onClick(async () => {
      this.plugin.settings = Object.assign({}, DEFAULT_SETTINGS);
      await this.plugin.saveSettings();
      this.display();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u65F6\u95F4\u8F74\u7EBF\u5BBD\u5EA6").setDesc("\u8BBE\u7F6E\u4E3B\u65F6\u95F4\u8F74\u7EBF\u7684\u5BBD\u5EA6\uFF08\u50CF\u7D20\uFF09").addSlider((slider) => slider.setLimits(1, 10, 1).setValue(this.plugin.settings.lineWidth).onChange(async (value) => {
      this.plugin.settings.lineWidth = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u65F6\u95F4\u8F74\u7EBF\u989C\u8272").setDesc("\u8BBE\u7F6E\u65F6\u95F4\u8F74\u7EBF\u7684\u989C\u8272").addColorPicker((color) => color.setValue(this.plugin.settings.lineColor).onChange(async (value) => {
      this.plugin.settings.lineColor = value;
      await this.plugin.saveSettings();
    })).addText((text) => text.setPlaceholder("\u70B9\u51FB\u5DE6\u4FA7\u8272\u76D8\u9009\u62E9\u989C\u8272").setValue("").onChange(async (value) => {
      if (value) {
        this.plugin.settings.lineColor = value;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian5.Setting(containerEl).setName("\u9879\u76EE\u95F4\u8DDD").setDesc("\u8BBE\u7F6E\u65F6\u95F4\u8F74\u9879\u76EE\u4E4B\u95F4\u7684\u95F4\u8DDD\uFF08\u50CF\u7D20\uFF09").addSlider((slider) => slider.setLimits(10, 100, 5).setValue(this.plugin.settings.itemSpacing).onChange(async (value) => {
      this.plugin.settings.itemSpacing = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u5361\u7247\u80CC\u666F\u8272").setDesc("\u8BBE\u7F6E\u5185\u5BB9\u5361\u7247\u7684\u80CC\u666F\u989C\u8272").addColorPicker((color) => color.setValue(this.plugin.settings.cardBackground).onChange(async (value) => {
      this.plugin.settings.cardBackground = value;
      await this.plugin.saveSettings();
    })).addText((text) => text.setPlaceholder("\u70B9\u51FB\u5DE6\u4FA7\u8272\u76D8\u9009\u62E9\u989C\u8272").setValue("").onChange(async (value) => {
      if (value) {
        this.plugin.settings.cardBackground = value;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian5.Setting(containerEl).setName("\u52A8\u753B\u6301\u7EED\u65F6\u95F4").setDesc("\u8BBE\u7F6E\u60AC\u505C\u52A8\u753B\u7684\u6301\u7EED\u65F6\u95F4\uFF08\u6BEB\u79D2\uFF09").addSlider((slider) => slider.setLimits(0, 1e3, 50).setValue(this.plugin.settings.animationDuration).onChange(async (value) => {
      this.plugin.settings.animationDuration = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u65E5\u671F\u5C5E\u6027").setDesc("\u9009\u62E9\u7528\u4E8E\u65F6\u95F4\u8F74\u6392\u5E8F\u7684 frontmatter \u65E5\u671F\u5C5E\u6027\uFF08\u5982\uFF1Acreated, updated, date \u7B49\uFF09").addText((text) => text.setPlaceholder("\u8F93\u5165\u65E5\u671F\u5C5E\u6027\u540D").setValue(this.plugin.settings.dateAttribute).onChange(async (value) => {
      this.plugin.settings.dateAttribute = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u6587\u4EF6\u540D\u524D\u7F00").setDesc("\u8BBE\u7F6E\u751F\u6210\u7684\u65F6\u95F4\u8F74\u6587\u4EF6\u540D\u524D\u7F00").addText((text) => text.setPlaceholder("\u8F93\u5165\u524D\u7F00").setValue(this.plugin.settings.fileNamePrefix).onChange(async (value) => {
      this.plugin.settings.fileNamePrefix = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u6587\u4EF6\u540D\u540E\u7F00").setDesc("\u8BBE\u7F6E\u751F\u6210\u7684\u65F6\u95F4\u8F74\u6587\u4EF6\u540D\u540E\u7F00").addText((text) => text.setPlaceholder("\u8F93\u5165\u540E\u7F00").setValue(this.plugin.settings.fileNameSuffix).onChange(async (value) => {
      this.plugin.settings.fileNameSuffix = value;
      await this.plugin.saveSettings();
    }));
    new import_obsidian5.Setting(containerEl).setName("\u9ED8\u8BA4\u4F4D\u7F6E").setDesc("\u9009\u62E9\u65F6\u95F4\u8F74\u89C6\u56FE\u5728\u5DE6\u4FA7\u8FD8\u662F\u53F3\u4FA7\u8FB9\u680F\u663E\u793A").addDropdown(
      (dropdown) => dropdown.addOption("left", "\u5DE6\u4FA7\u8FB9\u680F").addOption("right", "\u53F3\u4FA7\u8FB9\u680F").setValue(this.plugin.settings.defaultPosition).onChange(async (value) => {
        this.plugin.settings.defaultPosition = value;
        await this.plugin.saveSettings();
      })
    );
  }
};
