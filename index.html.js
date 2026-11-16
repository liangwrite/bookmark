/**
 * 极简书签 · 交互增强
 * 1. 保持原始 index.html 结构不变
 * 2. 为超长链接、重复标题等提供轻量增强
 * 3. 双击卡片标题可折叠/展开该卡片内容（纯增强，不影响原有功能）
 */
(function () {
  "use strict";

  /* ---------- 工具函数 ---------- */
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---------- 1. 超长链接：悬停显示完整 URL ---------- */
  function enhanceLongLinks() {
    var links = document.querySelectorAll(".block a");
    links.forEach(function (link) {
      var text = (link.textContent || "").trim();
      var href = link.getAttribute("href") || "";
      // 如果显示文字本身就很长（超过 40 字符），或 href 超长，则添加 title 提示
      if (text.length > 40 || href.length > 80) {
        if (!link.getAttribute("title")) {
          link.setAttribute("title", text || href);
        }
      }
    });
  }

  /* ---------- 2. 卡片标题折叠 ---------- */
  function enhanceCardCollapse() {
    var blocks = document.querySelectorAll(".block");
    blocks.forEach(function (block) {
      var h3 = block.querySelector("h3");
      if (!h3) return;

      // 包裹除标题外的其余内容，便于折叠
      var wrap = document.createElement("div");
      wrap.className = "block-body";

      var nodes = [];
      var next = h3.nextSibling;
      while (next) {
        var toMove = next;
        next = next.nextSibling;
        nodes.push(toMove);
      }
      nodes.forEach(function (node) {
        wrap.appendChild(node);
      });
      block.appendChild(wrap);

      // 让标题可点击
      h3.style.cursor = "pointer";
      h3.setAttribute("title", "点击折叠 / 展开");

      // 小箭头提示
      var arrow = document.createElement("span");
      arrow.className = "block-arrow";
      arrow.textContent = "▾";
      arrow.style.marginLeft = "0.45rem";
      arrow.style.fontSize = "0.75em";
      arrow.style.opacity = "0.55";
      arrow.style.transition = "transform 0.25s ease";
      h3.appendChild(arrow);

      h3.addEventListener("click", function () {
        var collapsed = block.classList.toggle("is-collapsed");
        arrow.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)";
        wrap.style.display = collapsed ? "none" : "";
      });
    });
  }

  /* ---------- 3. 键盘快捷搜索：按 "/" 聚焦页面内链接（简单高亮） ---------- */
  function enhanceQuickSearch() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var active = document.activeElement;
        var tag = active && active.tagName ? active.tagName.toLowerCase() : "";
        if (tag === "input" || tag === "textarea" || (active && active.isContentEditable)) {
          return;
        }
        e.preventDefault();
        var firstLink = document.querySelector(".block a");
        if (firstLink) {
          firstLink.focus();
          firstLink.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });
  }

  /* ---------- 4. 链接在新窗口打开时，增加 rel 安全属性 ---------- */
  function enhanceTargetBlankSafety() {
    document.querySelectorAll('.block a[target="_blank"]').forEach(function (link) {
      var rel = link.getAttribute("rel") || "";
      var parts = rel.split(/\s+/).filter(Boolean);
      if (parts.indexOf("noopener") === -1) parts.push("noopener");
      if (parts.indexOf("noreferrer") === -1) parts.push("noreferrer");
      link.setAttribute("rel", parts.join(" "));
    });
  }

  /* ---------- 启动 ---------- */
  onReady(function () {
    enhanceLongLinks();
    enhanceCardCollapse();
    enhanceQuickSearch();
    enhanceTargetBlankSafety();
  });
})();