// Activity Management
class TravelPlanner {
  constructor() {
    this.activities = JSON.parse(localStorage.getItem('activities')) || [];
    this.currentDay = 1;
    this.init();
  }

  init() {
    this.initEventListeners();
    this.renderActivities();
    this.initDragAndDrop();
  }

  initEventListeners() {
    // Day selection
    document.querySelectorAll('.day-selector').forEach(button => {
      button.addEventListener('click', (e) => {
        this.currentDay = parseInt(e.target.dataset.day) || 1;
        this.renderActivities();
      });
    });

    // Add new activity
    document.querySelector('.add-activity-card').addEventListener('click', () => {
      this.showAddActivityModal();
    });

    // Save activity form
    document.getElementById('activity-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveActivity();
    });
  }

  showAddActivityModal() {
    const modal = document.getElementById('add-activity-modal');
    modal.classList.remove('hidden');
  }

  hideAddActivityModal() {
    const modal = document.getElementById('add-activity-modal');
    modal.classList.add('hidden');
  }

  saveActivity() {
    const form = document.getElementById('activity-form');
    const activity = {
      id: Date.now(),
      day: this.currentDay,
      title: form.title.value,
      time: form.time.value,
      location: form.location.value,
      notes: form.notes.value,
      reminder: form.reminder.checked,
      attachments: [],
      order: this.activities.length
    };

    this.activities.push(activity);
    this.saveToLocalStorage();
    this.renderActivities();
    this.hideAddActivityModal();
    form.reset();
  }

  deleteActivity(id) {
    this.activities = this.activities.filter(activity => activity.id !== id);
    this.saveToLocalStorage();
    this.renderActivities();
  }

  updateActivity(id, updates) {
    this.activities = this.activities.map(activity => 
      activity.id === id ? { ...activity, ...updates } : activity
    );
    this.saveToLocalStorage();
    this.renderActivities();
  }

  saveToLocalStorage() {
    localStorage.setItem('activities', JSON.stringify(this.activities));
  }

  renderActivities() {
    const container = document.querySelector('.planner-cards-container');
    const activities = this.activities
      .filter(activity => activity.day === this.currentDay)
      .sort((a, b) => a.order - b.order);

    const html = activities.map(activity => this.createActivityCard(activity)).join('');
    container.innerHTML = html + this.createAddActivityCard();
  }

  createActivityCard(activity) {
    return `
      <div class="planner-card" draggable="true" data-id="${activity.id}">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold">${activity.title}</h3>
              <div class="flex items-center text-gray-600 mt-1">
                <i class="ri-time-line mr-2"></i>
                <input type="time" value="${activity.time}" class="time-input text-gray-700 border-none" 
                  onchange="planner.updateActivity(${activity.id}, {time: this.value})">
              </div>
            </div>
            <div class="flex space-x-2">
              <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full drag-handle">
                <i class="ri-drag-move-line text-gray-600"></i>
              </button>
              <div class="relative">
                <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full emoji-toggle">
                  <i class="ri-emotion-happy-line text-gray-600"></i>
                </button>
                <div class="emoji-picker hidden">
                  <button class="emoji-btn">😊</button>
                  <button class="emoji-btn">🌴</button>
                  <button class="emoji-btn">🏖️</button>
                  <button class="emoji-btn">🍹</button>
                  <button class="emoji-btn">🏄</button>
                  <button class="emoji-btn">🚶</button>
                  <button class="emoji-btn">🍽️</button>
                  <button class="emoji-btn">🛌</button>
                  <button class="emoji-btn">🚗</button>
                  <button class="emoji-btn">📸</button>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <div class="flex items-center mb-2">
              <i class="ri-map-pin-line mr-2 text-primary"></i>
              <input type="text" value="${activity.location}" class="text-gray-700 border-none bg-transparent"
                onchange="planner.updateActivity(${activity.id}, {location: this.value})">
            </div>
            <textarea placeholder="Add notes here..." class="w-full h-24 p-3 bg-gray-50 border-none rounded text-gray-700 resize-none"
              onchange="planner.updateActivity(${activity.id}, {notes: this.value})">${activity.notes}</textarea>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <label class="custom-switch mr-3">
                <input type="checkbox" ${activity.reminder ? 'checked' : ''}
                  onchange="planner.updateActivity(${activity.id}, {reminder: this.checked})">
                <span class="slider"></span>
              </label>
              <span class="text-sm text-gray-600">Reminder</span>
            </div>
            <div class="flex space-x-2">
              <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full attachment-btn"
                onclick="document.getElementById('attachment-input-${activity.id}').click()">
                <i class="ri-attachment-2 text-gray-600"></i>
              </button>
              <input type="file" id="attachment-input-${activity.id}" class="hidden" 
                onchange="planner.handleAttachment(${activity.id}, this.files[0])">
              <button class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                onclick="planner.deleteActivity(${activity.id})">
                <i class="ri-delete-bin-line text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createAddActivityCard() {
    return `
      <div class="add-activity-card border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-64 cursor-pointer hover:border-primary transition-colors">
        <div class="text-center">
          <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i class="ri-add-line ri-lg text-primary"></i>
          </div>
          <p class="text-gray-600">Add New Activity</p>
        </div>
      </div>
    `;
  }

  initDragAndDrop() {
    const container = document.querySelector('.planner-cards-container');
    
    container.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('planner-card')) {
        e.target.classList.add('dragging');
      }
    });

    container.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('planner-card')) {
        e.target.classList.remove('dragging');
      }
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggable = document.querySelector('.dragging');
      if (!draggable) return;

      const afterElement = this.getDragAfterElement(container, e.clientY);
      if (afterElement) {
        container.insertBefore(draggable, afterElement);
      } else {
        container.appendChild(draggable);
      }
    });

    container.addEventListener('drop', () => {
      this.updateOrder();
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.planner-card:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  updateOrder() {
    const cards = document.querySelectorAll('.planner-card');
    cards.forEach((card, index) => {
      const id = parseInt(card.dataset.id);
      this.updateActivity(id, { order: index });
    });
  }

  handleAttachment(activityId, file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const activity = this.activities.find(a => a.id === activityId);
      if (activity) {
        activity.attachments.push({
          name: file.name,
          type: file.type,
          data: e.target.result
        });
        this.saveToLocalStorage();
      }
    };
    reader.readAsDataURL(file);
  }

  checkReminders() {
    const now = new Date();
    this.activities.forEach(activity => {
      if (activity.reminder) {
        const activityTime = new Date(activity.time);
        const timeDiff = activityTime - now;
        if (timeDiff > 0 && timeDiff <= 30 * 60 * 1000) { // 30 minutes before
          this.showReminderNotification(activity);
        }
      }
    });
  }

  showReminderNotification(activity) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Reminder: ${activity.title}`, {
        body: `Your activity at ${activity.location} starts in 30 minutes!`,
        icon: '/favicon.ico'
      });
    }
  }
}

// Initialize the planner
const planner = new TravelPlanner();

// Check for reminders every minute
setInterval(() => planner.checkReminders(), 60000);

// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission();
} 