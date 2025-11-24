var t = TrelloPowerUp.initialize({
    // CHANGE THIS CAPABILITY
    'board-buttons': function(t) { 
        return [{
            // icon path must be correct relative to the root URL
            icon: './images/clock_icon.svg', 
            text: 'Recent Activity', 
            callback: function(t) {
                // The action still opens the popup to display all cards globally
                return t.popup({
                    title: 'Recently Modified Cards',
                    url: './recent_activity_popup.html' 
                });
            }
        }];
    }
    // Remove the 'header-buttons' reference if it was there
});
