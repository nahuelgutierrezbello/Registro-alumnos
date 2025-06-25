// Clase para manejar la API
class APIClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.headers,
        ...options,
      };

      if (options.body) {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error: ${response.status}`);
      }

      return response.status === 204 ? null : await response.json();
    } catch (error) {
      console.error(`Error en ${endpoint}:`, error);
      throw error;
    }
  }
}

// Clase para manejar mensajes y notificaciones
class UIHelper {
  static showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const icon = isError ? "fa-exclamation-circle" : "fa-check-circle";
    const type = isError ? "message-error" : "message-success";

    element.innerHTML = `
      <div class="${type}">
        <i class="fas ${icon}"></i>
        <span>${message}</span>
      </div>
    `;

    element.style.display = "block";

    // Limpiar después de 5 segundos
    setTimeout(() => {
      element.innerHTML = "";
      element.style.display = "none";
    }, 5000);
  }

  static showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast ${isError ? "toast-error" : "toast-success"}`;
    toast.innerHTML = `
      <i class="fas ${
        isError ? "fa-exclamation-circle" : "fa-check-circle"
      }"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Mostrar con retraso para permitir la renderización
    setTimeout(() => toast.classList.add("show"), 100);

    // Ocultar después de 3 segundos
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }
}

// Clase para manejar el carrusel de novedades mejorado
class EnhancedNewsSlider {
  constructor() {
    this.slides = document.querySelectorAll(".slide");
    this.dots = document.querySelectorAll(".slider-dots .slider-btn");
    this.currentIndex = 0;
    this.interval = null;
    this.init();
  }

  init() {
    document
      .querySelector(".slider-btn.prev")
      ?.addEventListener("click", () => this.prevSlide());
    document
      .querySelector(".slider-btn.next")
      ?.addEventListener("click", () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    this.startAutoPlay();
    this.showSlide(this.currentIndex);

    // Agregar eventos para pausar al pasar el mouse
    const slider = document.querySelector(".slider");
    if (slider) {
      slider.addEventListener("mouseenter", () => this.pauseAutoPlay());
      slider.addEventListener("mouseleave", () => this.resumeAutoPlay());
    }
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    this.currentIndex = index;

    // Efecto de zoom sutil
    if (this.slides[index]) {
      this.slides[index].style.transform = "scale(1.02)";
      setTimeout(() => {
        this.slides[index].style.transform = "scale(1)";
      }, 500);
    }
  }

  nextSlide() {
    const newIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(newIndex);
  }

  prevSlide() {
    const newIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(newIndex);
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.nextSlide(), 5000);
  }

  pauseAutoPlay() {
    clearInterval(this.interval);
  }

  resumeAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  }
}

// Clase para manejar el botón de WhatsApp flotante
class WhatsAppFloatButton {
  constructor() {
    this.init();
  }

  init() {
    // Eliminar botón existente si hay uno
    const existingBtn = document.getElementById("whatsapp-float");
    if (existingBtn) {
      existingBtn.remove();
    }

    // Crear el nuevo botón
    const whatsappBtn = document.createElement("a");
    whatsappBtn.id = "whatsapp-float";
    whatsappBtn.className = "whatsapp-float";
    whatsappBtn.href = "https://wa.me/5492241123456";
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener noreferrer";
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.setAttribute("aria-label", "Contactar por WhatsApp");

    // Insertar antes del cierre del body para asegurar posición correcta
    document.body.appendChild(whatsappBtn);
  }
}

// Clase para manejar eventos
class EventManager {
  constructor(app) {
    this.app = app;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Solo configurar listeners si los elementos existen
    const registerForm = document.getElementById("registerForm");
    if (registerForm)
      registerForm.addEventListener("submit", (e) =>
        this.app.registerStudent(e)
      );

    const assignBtn = document.getElementById("assignCareerBtn");
    if (assignBtn)
      assignBtn.addEventListener("click", () => this.app.assignCareer());

    const closeModal = document.getElementById("closeAssignCareerModal");
    if (closeModal)
      closeModal.addEventListener("click", () => {
        document.getElementById("assignCareerModal").classList.add("hidden");
      });

    const closeModal2 = document.getElementById("closeAssignCareerModal2");
    if (closeModal2)
      closeModal2.addEventListener("click", () => {
        document.getElementById("assignCareerModal").classList.add("hidden");
      });

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn)
      searchBtn.addEventListener("click", () => this.app.performSearch());

    const searchType = document.getElementById("searchType");
    if (searchType)
      searchType.addEventListener("change", () => this.app.toggleSearchInput());

    const categoryForm = document.getElementById("createCategoryForm");
    if (categoryForm)
      categoryForm.addEventListener("submit", (e) =>
        this.app.createCategory(e)
      );

    const careerForm = document.getElementById("createCareerForm");
    if (careerForm)
      careerForm.addEventListener("submit", (e) => this.app.createCareer(e));

    const contactForm = document.getElementById("contactForm");
    if (contactForm)
      contactForm.addEventListener("submit", (e) =>
        this.app.submitContactForm(e)
      );

    // Inicializar búsqueda solo si los elementos existen
    if (
      searchType &&
      document.getElementById("idSearchGroup") &&
      document.getElementById("careerSearchGroup")
    ) {
      this.app.toggleSearchInput();
    }

    // Agregar listener para el botón de eliminar estudiante
    const deleteStudentBtn = document.getElementById("deleteStudentBtn");
    if (deleteStudentBtn) {
      deleteStudentBtn.addEventListener("click", () => {
        const studentId = parseInt(
          document.getElementById("deleteId").value || 0
        );
        if (studentId) {
          this.app.deleteStudent(studentId);
        } else {
          UIHelper.showMessage(
            "deleteResult",
            "Por favor ingrese un ID válido",
            true
          );
        }
      });
    }
  }
}

// Clase mejorada para manejar eventos
class EnhancedEventManager extends EventManager {
  constructor(app) {
    super(app);
    this.setupEnhancedEventListeners();
  }

  setupEnhancedEventListeners() {
    super.setupEventListeners();

    // Botón de eliminar estudiante en los resultados de búsqueda
    document.getElementById("searchResults")?.addEventListener("click", (e) => {
      if (e.target.closest(".btn-delete-student")) {
        const studentId = parseInt(
          e.target.closest(".btn-delete-student").dataset.id
        );
        if (studentId) this.app.deleteStudent(studentId, true);
      }
    });
  }
}

// Clase principal de la aplicación mejorada
class EnhancedAcademicApp {
  constructor() {
    this.api = new APIClient("http://localhost:5001/api", "12345ABCDEF");
    this.students = [];
    this.careers = [];
    this.categories = [];
    this.eventManager = new EnhancedEventManager(this);
    this.init();
  }

  async init() {
    try {
      // Cargar datos iniciales
      await this.loadCareers();
      await this.loadCategories();

      // Intentar cargar estudiantes con filtro por defecto si es necesario
      if (this.careers.length > 0) {
        await this.loadStudentsWithDefaultFilter();
      } else {
        this.students = [];
      }

      this.renderAll();

      // Iniciar características mejoradas
      this.initEnhancedFeatures();
    } catch (error) {
      console.error("Error inicializando la aplicación:", error);
      UIHelper.showMessage("general", "Error al iniciar la aplicación", true);
    }
  }

  initEnhancedFeatures() {
    // Iniciar carrusel mejorado
    if (document.querySelector(".slider")) {
      new EnhancedNewsSlider();
    }

    // Iniciar botón de WhatsApp
    new WhatsAppFloatButton();

    // Mejorar estilos de eventos en novedades
    this.enhanceNewsEvents();
  }

  enhanceNewsEvents() {
    // Agregar efectos a los eventos
    const events = document.querySelectorAll(".compact-event");
    events.forEach((event) => {
      event.addEventListener("mouseenter", () => {
        event.style.transform = "translateY(-5px)";
        event.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
      });

      event.addEventListener("mouseleave", () => {
        event.style.transform = "translateY(0)";
        event.style.boxShadow = "var(--box-shadow)";
      });

      // Efecto al hacer clic en botones
      const buttons = event.querySelectorAll(
        ".btn-event-action, .btn-event-register"
      );
      buttons.forEach((btn) => {
        btn.addEventListener("mousedown", () => {
          btn.style.transform = "scale(0.95)";
        });

        btn.addEventListener("mouseup", () => {
          btn.style.transform = "scale(1)";
        });

        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "scale(1)";
        });
      });
    });
  }

  async loadStudentsWithDefaultFilter() {
    try {
      // Usar la primera carrera como filtro por defecto
      const defaultCareer = this.careers[0].name;
      this.students = await this.api.request(
        `/students?career=${encodeURIComponent(defaultCareer)}`
      );
    } catch (error) {
      console.warn("Error cargando estudiantes con filtro:", error);
      this.students = [];
    }
  }

  async loadCareers() {
    try {
      this.careers = await this.api.request("/careers");
    } catch (error) {
      console.error("Error cargando carreras:", error);
      this.careers = [];
    }
  }

  async loadCategories() {
    try {
      this.categories = await this.api.request("/categories");
    } catch (error) {
      console.error("Error cargando categorías:", error);
      this.categories = [];
    }
  }

  renderAll() {
    this.renderStudents();
    this.renderCareers();
    this.renderCategories();
    this.populateCareerDropdowns();
    this.populateCategoryDropdown();
  }

  renderStudents(containerId = "searchResults") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (this.students.length === 0) {
      container.innerHTML = `
        <div class="text-center py-4 text-gray-500">
          <i class="fas fa-user-graduate text-2xl mb-2"></i>
          <p>No se encontraron estudiantes</p>
        </div>`;
      return;
    }

    container.innerHTML = this.students
      .map(
        (student) => `
      <div class="student-card bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 class="student-name font-semibold text-lg">${student.name}</h3>
        <div class="student-details text-sm text-gray-600 mt-2">
          <span>ID: ${student.id}</span>
          <span>Carrera: ${student.career || "No asignada"}</span>
        </div>
        <div class="student-actions mt-4 flex justify-end space-x-2">
          <button class="btn btn-sm btn-danger btn-delete-student" data-id="${
            student.id
          }">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
          <button class="btn btn-sm btn-primary" onclick="app.showAssignCareerModal(${
            student.id
          }, '${student.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-graduation-cap"></i> Asignar Carrera
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  renderCareers(containerId = "careersGrid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.careers
      .map((career) => {
        const studentsInCareer = this.students.filter(
          (s) => s.career === career.name
        ).length;
        return `
        <div class="career-card">
          <div class="career-header bg-blue-600 text-white p-4">
            <h4>${career.name}</h4>
          </div>
          <div class="career-body p-4">
            <span><i class="fas fa-users mr-1"></i> ${studentsInCareer} estudiantes</span>
            <div class="career-actions mt-4 flex justify-end">
              <button class="btn btn-sm btn-danger" onclick="app.deleteCareer(${career.id})">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  renderCategories(containerId = "categoriesGrid") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.categories
      .map(
        (cat) => `
      <div class="category-card">
        <div class="category-header bg-purple-600 text-white p-4">
          <h3>${cat.name}</h3>
        </div>
        <div class="category-body p-4">
          <button class="btn btn-sm btn-danger" onclick="app.deleteCategory(${cat.id})">
            <i class="fas fa-trash-alt mr-1"></i> Eliminar
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  populateCareerDropdowns() {
    const ids = ["registerCareer", "careerFilter", "assignCareerSelect"];
    ids.forEach((id) => {
      const select = document.getElementById(id);
      if (!select) return;
      select.innerHTML = `<option value="">${
        id === "careerFilter" ? "Todas las carreras" : "Seleccione una carrera"
      }</option>`;
      this.careers.forEach((career) => {
        const option = document.createElement("option");
        option.value = career.id;
        option.textContent = career.name;
        select.appendChild(option);
      });
    });
  }

  populateCategoryDropdown() {
    const select = document.getElementById("newCareerCategory");
    if (!select) return;
    select.innerHTML = `<option value="">Sin categoría</option>`;
    this.categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }

  toggleSearchInput() {
    const searchType = document.getElementById("searchType");
    const idSearchGroup = document.getElementById("idSearchGroup");
    const careerSearchGroup = document.getElementById("careerSearchGroup");

    if (!searchType || !idSearchGroup || !careerSearchGroup) return;

    idSearchGroup.style.display = searchType.value === "id" ? "block" : "none";
    careerSearchGroup.style.display =
      searchType.value === "career" ? "block" : "none";
  }

  async performSearch() {
    const type = document.getElementById("searchType")?.value;
    const container = document.getElementById("searchResults");
    if (!container) return;

    container.innerHTML = `<div class='text-center py-4'><i class='fas fa-spinner fa-spin'></i> Buscando...</div>`;

    try {
      let result = [];
      if (type === "id") {
        const id = parseInt(document.getElementById("studentId")?.value || 0);
        if (!id) throw new Error("ID requerido");
        result = [await this.api.request(`/students/${id}`)];
      } else {
        const careerId = document.getElementById("careerFilter")?.value;
        if (careerId) {
          const career = this.careers.find((c) => c.id == careerId);
          if (!career) throw new Error("Carrera no encontrada");
          result = await this.api.request(
            `/students?career=${encodeURIComponent(career.name)}`
          );
        } else {
          throw new Error("Por favor selecciona una carrera para filtrar");
        }
      }
      this.renderStudentsFromArray(result);
    } catch (err) {
      UIHelper.showMessage("searchResults", err.message, true);
    }
  }

  renderStudentsFromArray(list, containerId = "searchResults") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!list.length) {
      container.innerHTML = `
        <div class='text-center py-4'>
          <i class='fas fa-user-graduate'></i> 
          <p>No se encontraron resultados</p>
        </div>`;
      return;
    }

    container.innerHTML = list
      .map(
        (s) => `
      <div class="student-card bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 class="student-name font-semibold text-lg">${s.name}</h3>
        <div class="student-details text-sm text-gray-600 mt-2">
          <span>ID: ${s.id}</span>
          <span>Carrera: ${s.career || "No asignada"}</span>
        </div>
        <div class="student-actions mt-4 flex justify-end space-x-2">
          <button class="btn btn-sm btn-danger btn-delete-student" data-id="${
            s.id
          }">
            <i class="fas fa-trash-alt"></i> Eliminar
          </button>
          <button class="btn btn-sm btn-primary" onclick="app.showAssignCareerModal(${
            s.id
          }, '${s.name.replace(/'/g, "\\'")}')">
            <i class="fas fa-graduation-cap"></i> Asignar Carrera
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  async deleteStudent(id, fromSearch = false) {
    if (!confirm("¿Está seguro que desea eliminar este estudiante?")) return;

    try {
      await this.api.request(`/students/${id}`, { method: "DELETE" });

      // Actualizar la lista de estudiantes
      this.students = this.students.filter((s) => s.id !== id);

      // Mostrar mensaje según desde dónde se llamó
      if (fromSearch) {
        this.performSearch(); // Refrescar los resultados de búsqueda
        UIHelper.showToast("Estudiante eliminado correctamente");
      } else {
        this.renderStudents();
        UIHelper.showMessage(
          "deleteResult",
          "Estudiante eliminado correctamente"
        );
      }

      UIHelper.showToast("Estudiante eliminado correctamente");
    } catch (error) {
      UIHelper.showToast("Error al eliminar estudiante", true);

      if (fromSearch) {
        UIHelper.showMessage(
          "searchResults",
          "Error al eliminar estudiante: " + error.message,
          true
        );
      } else {
        UIHelper.showMessage(
          "deleteResult",
          "Error al eliminar estudiante: " + error.message,
          true
        );
      }
    }
  }

  async deleteCareer(id) {
    if (!confirm("¿Está seguro que desea eliminar esta carrera?")) return;
    try {
      await this.api.request(`/careers/${id}`, { method: "DELETE" });
      this.careers = this.careers.filter((c) => c.id !== id);
      this.renderCareers();
      this.populateCareerDropdowns();
      UIHelper.showMessage("general", "Carrera eliminada correctamente");
    } catch (error) {
      UIHelper.showMessage(
        "general",
        "Error al eliminar carrera: " + error.message,
        true
      );
    }
  }

  async deleteCategory(id) {
    if (!confirm("¿Está seguro que desea eliminar esta categoría?")) return;
    try {
      await this.api.request(`/categories/${id}`, { method: "DELETE" });
      this.categories = this.categories.filter((c) => c.id !== id);
      this.renderCategories();
      this.populateCategoryDropdown();
      UIHelper.showMessage("general", "Categoría eliminada correctamente");
    } catch (error) {
      UIHelper.showMessage(
        "general",
        "Error al eliminar categoría: " + error.message,
        true
      );
    }
  }

  async registerStudent(e) {
    e.preventDefault();
    const name = document.getElementById("registerName")?.value.trim();
    const careerId = document.getElementById("registerCareer")?.value;
    const career = this.careers.find((c) => c.id == careerId);

    if (!name) {
      return UIHelper.showMessage(
        "registerResult",
        "El nombre es requerido",
        true
      );
    }

    if (!career) {
      return UIHelper.showMessage(
        "registerResult",
        "Debe seleccionar una carrera válida",
        true
      );
    }

    try {
      const result = await this.api.request("/students", {
        method: "POST",
        body: { name, career: career.name },
      });

      this.students.push(result.student);
      this.renderStudents();
      document.getElementById("registerForm").reset();
      UIHelper.showMessage(
        "registerResult",
        `Estudiante registrado: ${result.student.name}`
      );
    } catch (error) {
      UIHelper.showMessage(
        "registerResult",
        "Error al registrar estudiante: " + error.message,
        true
      );
    }
  }

  async createCareer(e) {
    e.preventDefault();
    const name = document.getElementById("newCareerName")?.value.trim();

    if (!name) {
      return UIHelper.showMessage(
        "createCareerResult",
        "Nombre requerido",
        true
      );
    }

    try {
      const result = await this.api.request("/careers", {
        method: "POST",
        body: { name },
      });

      this.careers.push(result.career);
      this.renderCareers();
      this.populateCareerDropdowns();
      document.getElementById("createCareerForm").reset();
      UIHelper.showMessage(
        "createCareerResult",
        `Carrera creada: ${result.career.name}`
      );
    } catch (error) {
      UIHelper.showMessage(
        "createCareerResult",
        "Error al crear carrera: " + error.message,
        true
      );
    }
  }

  async createCategory(e) {
    e.preventDefault();
    const name = document.getElementById("newCategoryName")?.value.trim();

    if (!name) {
      return UIHelper.showMessage(
        "createCategoryResult",
        "Nombre requerido",
        true
      );
    }

    try {
      const result = await this.api.request("/categories", {
        method: "POST",
        body: { name },
      });

      this.categories.push(result.category);
      this.renderCategories();
      this.populateCategoryDropdown();
      document.getElementById("createCategoryForm").reset();
      UIHelper.showMessage(
        "createCategoryResult",
        `Categoría creada: ${result.category.name}`
      );
    } catch (error) {
      UIHelper.showMessage(
        "createCategoryResult",
        "Error al crear categoría: " + error.message,
        true
      );
    }
  }

  showAssignCareerModal(id, name) {
    const modal = document.getElementById("assignCareerModal");
    if (!modal) return;

    // Resetear el modal
    document.getElementById("assignCareerMessage").innerHTML = "";
    document.getElementById("assignCareerSelect").value = "";

    // Configurar datos
    document.getElementById("assignStudentId").value = id;
    document.getElementById("assignStudentName").value = name;

    // Mostrar con animación
    modal.classList.remove("hidden");
    modal.style.opacity = 0;
    setTimeout(() => {
      modal.style.opacity = 1;
      document.getElementById("assignCareerSelect").focus();
    }, 10);
  }

  async assignCareer() {
    const studentId = parseInt(
      document.getElementById("assignStudentId")?.value || 0
    );
    const careerId = parseInt(
      document.getElementById("assignCareerSelect")?.value || 0
    );

    if (!studentId || !careerId) {
      return UIHelper.showMessage(
        "assignCareerMessage",
        "Por favor complete todos los campos",
        true
      );
    }

    const student = this.students.find((s) => s.id === studentId);
    const career = this.careers.find((c) => c.id === careerId);

    if (!student) {
      return UIHelper.showMessage(
        "assignCareerMessage",
        "Estudiante no encontrado",
        true
      );
    }

    if (!career) {
      return UIHelper.showMessage(
        "assignCareerMessage",
        "Por favor seleccione una carrera válida",
        true
      );
    }

    const assignBtn = document.getElementById("assignCareerBtn");
    const originalText = assignBtn.innerHTML;
    assignBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Asignando...';
    assignBtn.disabled = true;

    try {
      const updated = await this.api.request(`/students/${studentId}`, {
        method: "PUT",
        body: {
          name: student.name,
          career: career.name,
        },
      });

      // Actualizar datos
      this.students = this.students.map((s) =>
        s.id === studentId ? updated : s
      );
      this.renderStudents();

      // Mostrar SweetAlert de éxito
      Swal.fire({
        title: "¡Éxito!",
        text: `Carrera "${career.name}" asignada correctamente a ${student.name}`,
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          document.getElementById("assignCareerModal").classList.add("hidden");
          document.getElementById("assignCareerMessage").innerHTML = "";
        },
      });

      UIHelper.showToast(`Carrera asignada correctamente a ${student.name}`);
    } catch (error) {
      // Mostrar SweetAlert de error
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      assignBtn.innerHTML = originalText;
      assignBtn.disabled = false;
    }
  }

  async submitContactForm(e) {
    e.preventDefault();
    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const subject = document.getElementById("contactSubject")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    if (!name || !email || !subject || !message) {
      return UIHelper.showMessage(
        "contactResult",
        "Todos los campos son requeridos",
        true
      );
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      document.getElementById("contactForm").reset();
      UIHelper.showMessage(
        "contactResult",
        "Mensaje enviado correctamente. Nos pondremos en contacto pronto."
      );
    } catch (error) {
      UIHelper.showMessage(
        "contactResult",
        "Error al enviar el mensaje. Por favor intente nuevamente.",
        true
      );
    }
  }
}

// Inicializar aplicación mejorada
const app = new EnhancedAcademicApp();
