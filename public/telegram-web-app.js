// Telegram Web App SDK stub for development
// In production, this will be loaded from Telegram
if (typeof window !== 'undefined' && !window.Telegram) {
  window.Telegram = {
    WebApp: {
      ready: function() { console.log('Telegram WebApp ready') },
      expand: function() { console.log('Telegram WebApp expanded') },
      close: function() { console.log('Telegram WebApp closed') },
      enableClosingConfirmation: function() {},
      disableClosingConfirmation: function() {},
      isExpanded: true,
      viewportHeight: window.innerHeight,
      viewportStableHeight: window.innerHeight,
      headerColor: '#0f0f0f',
      backgroundColor: '#0f0f0f',
      isClosingConfirmationEnabled: false,
      BackButton: {
        show: function() {},
        hide: function() {},
        onClick: function(callback) {}
      },
      MainButton: {
        text: '',
        color: '#007aff',
        textColor: '#ffffff',
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText: function(text) { this.text = text },
        onClick: function(callback) {},
        show: function() { this.isVisible = true },
        hide: function() { this.isVisible = false },
        enable: function() { this.isActive = true },
        disable: function() { this.isActive = false },
        showProgress: function() { this.isProgressVisible = true },
        hideProgress: function() { this.isProgressVisible = false }
      },
      HapticFeedback: {
        impactOccurred: function(style) {},
        notificationOccurred: function(type) {},
        selectionChanged: function() {}
      },
      initData: '',
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          language_code: 'ru',
        }
      },
      version: '6.0',
      platform: 'unknown',
      colorScheme: 'dark',
      themeParams: {
        bg_color: '#0f0f0f',
        text_color: '#ffffff',
        hint_color: '#8e8e93',
        link_color: '#007aff',
        button_color: '#007aff',
        button_text_color: '#ffffff',
        secondary_bg_color: '#1c1c1e'
      },
      sendData: function(data) {},
      openLink: function(url, options) { window.open(url, '_blank') },
      openTelegramLink: function(url) {},
      showPopup: function(params, callback) {},
      showAlert: function(message, callback) { alert(message); if(callback) callback() },
      showConfirm: function(message, callback) { 
        const result = confirm(message)
        if(callback) callback(result)
      }
    }
  }
}








