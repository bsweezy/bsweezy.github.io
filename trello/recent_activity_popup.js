var t = TrelloPowerUp.iframe();

t.render(function(){
    const container = document.getElementById('card-list-container');
    
    t.getRestApi()
        .getToken()
        .then(function(token) {
            if (!token) {
                // If token is missing, ask the user to authorize
                container.innerHTML = 'Please authorize the Power-Up to view cards across boards. <button id="auth-btn">Authorize</button>';
                // Add event listener to trigger authorization
                document.getElementById('auth-btn').addEventListener('click', () => {
                    t.authorize({ scope: 'read' });
                });
                t.sizeTo(container).done();
                return;
            }
            
            // API call to get all visible cards for the member
            const cardsEndpoint = `/members/me/cards?filter=visible&fields=name,id,idBoard,dateLastActivity`;
            const cardsUrl = `https://api.trello.com/1${cardsEndpoint}&key=${t.key}&token=${token}`; 
            
            fetch(cardsUrl)
                .then(response => response.json())
                .then(allCards => {
                    // Sort by last activity descending
                    allCards.sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity));
                    const recentCards = allCards.slice(0, 15);
                    
                    // Fetch board names concurrently
                    const boardIds = [...new Set(recentCards.map(c => c.idBoard))];
                    const boardPromises = boardIds.map(boardId => 
                        fetch(`https://api.trello.com/1/boards/${boardId}?fields=name&key=${t.key}&token=${token}`)
                            .then(res => res.json())
                    );

                    return Promise.all(boardPromises).then(boards => {
                        const boardMap = new Map(boards.map(b => [b.id, b.name]));

                        let html = '<ul>';
                        recentCards.forEach(card => {
                            const dateOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
                            const date = new Date(card.dateLastActivity).toLocaleDateString('en-US', dateOptions);
                            const boardName = boardMap.get(card.idBoard) || 'Board Not Found';
                            
                            html += `<li>
                                <a href="#" data-card-id="${card.id}">
                                    <strong>${card.name}</strong><br>
                                    <small>on ${boardName} · ${date}</small>
                                </a>
                            </li>`;
                        });
                        html += '</ul>';

                        container.innerHTML = html;
                        t.sizeTo(container).done();
                    });
                });
        })
        .catch(error => {
            container.innerHTML = `Error fetching data: ${error.message}`;
            t.sizeTo(container).done();
        });
});

// Click handler to open the card
document.addEventListener('click', function(e) {
    const cardLink = e.target.closest('a');
    if (cardLink && cardLink.dataset.cardId) {
        e.preventDefault();
        t.showCard(cardLink.dataset.cardId);
        t.closePopup(); 
    }
});
