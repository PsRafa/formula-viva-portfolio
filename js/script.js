(function () {
  "use strict";

  /* ============ NAVIGATION (simulated multi-page SPA) ============ */
  var pages = document.querySelectorAll(".page");
  var navLinks = document.querySelectorAll("[data-nav]");
  var mainContent = document.getElementById("main-content");
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeMobileNav() {
    mainNav.classList.remove("is-open");
  }

  function showPage(name, opts) {
    var found = false;
    pages.forEach(function (p) {
      var isMatch = p.dataset.page === name;
      p.classList.toggle("is-active", isMatch);
      if (isMatch) found = true;
    });
    if (!found) {
      pages[0].classList.add("is-active");
      name = pages[0].dataset.page;
    }

    navLinks.forEach(function (a) {
      if (a.classList.contains("nav-link")) {
        a.classList.toggle("is-active", a.dataset.nav === name);
      }
    });

    document.title = pageTitle(name) + " | Fórmula Viva";

    if (!opts || opts.scroll !== false) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    closeMobileNav();
  }

  function pageTitle(name) {
    var map = {
      home: "Início",
      sobre: "Sobre",
      laboratorio: "Laboratório",
      servicos: "Serviços e Ativos",
      receita: "Envie sua Receita",
      contato: "Contato"
    };
    return map[name] || "Fórmula Viva";
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = link.dataset.nav;
      history.pushState(null, "", "#" + target);
      showPage(target);
    });
  });

  window.addEventListener("popstate", function () {
    var hash = window.location.hash.replace("#", "") || "home";
    showPage(hash);
  });

  /* initial load based on hash */
  (function initRoute() {
    var hash = window.location.hash.replace("#", "") || "home";
    showPage(hash, { scroll: false });
  })();

  /* ============ HEADER SCROLL STATE ============ */
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE NAV TOGGLE ============ */
  navToggle.addEventListener("click", function () {
    mainNav.classList.toggle("is-open");
  });

  /* ============ UPLOAD ZONE (Envie sua Receita) ============ */
  var uploadZone = document.getElementById("upload-zone");
  var fileInput = document.getElementById("file-receita");
  var fileList = document.getElementById("file-list");
  var selectedFiles = [];

  if (uploadZone && fileInput) {
    uploadZone.addEventListener("click", function () {
      fileInput.click();
    });

    ["dragenter", "dragover"].forEach(function (evt) {
      uploadZone.addEventListener(evt, function (e) {
        e.preventDefault();
        uploadZone.classList.add("is-dragover");
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      uploadZone.addEventListener(evt, function (e) {
        e.preventDefault();
        uploadZone.classList.remove("is-dragover");
      });
    });
    uploadZone.addEventListener("drop", function (e) {
      var files = e.dataTransfer.files;
      addFiles(files);
    });

    fileInput.addEventListener("change", function () {
      addFiles(fileInput.files);
      fileInput.value = "";
    });
  }

  function addFiles(fileListObj) {
    Array.prototype.forEach.call(fileListObj, function (file) {
      selectedFiles.push(file);
    });
    renderFileList();
  }

  function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function renderFileList() {
    if (!fileList) return;
    fileList.innerHTML = "";
    selectedFiles.forEach(function (file, index) {
      var li = document.createElement("li");

      var label = document.createElement("span");
      label.textContent = file.name + " — " + formatSize(file.size);

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "file-remove";
      remove.setAttribute("aria-label", "Remover arquivo");
      remove.textContent = "✕";
      remove.addEventListener("click", function () {
        removeFile(index);
      });

      li.appendChild(label);
      li.appendChild(remove);
      fileList.appendChild(li);
    });
  }

  /* ============ FORM SUBMISSION (simulated) ============ */
  function bindSimulatedForm(formId, resetExtra) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.classList.add("is-submitted");
      setTimeout(function () {
        form.classList.remove("is-submitted");
        form.reset();
        if (resetExtra) resetExtra();
      }, 4000);
    });
  }

  bindSimulatedForm("form-receita", function () {
    selectedFiles = [];
    renderFileList();
  });
  bindSimulatedForm("form-contato");
})();
