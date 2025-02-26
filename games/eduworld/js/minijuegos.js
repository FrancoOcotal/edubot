// Function to create and display the quiz modal
function startMiniGame(question, correctAnswer, options) {
    let existingModal = document.getElementById("minigameModal");
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    let modal = document.createElement('div');
    modal.id = "minigameModal";
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.3)';
    modal.style.zIndex = '1000';
    modal.style.textAlign = 'center';

    let questionText = document.createElement('p');
    questionText.innerText = question;
    modal.appendChild(questionText);

    options.forEach(option => {
        let button = document.createElement('button');
        button.innerText = option;
        button.style.margin = '5px';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.background = '#007BFF';
        button.style.color = 'white';
        button.style.borderRadius = '5px';

        button.addEventListener('click', () => {
            document.body.removeChild(modal);
            if (option === correctAnswer) {
                showCongratulations();
            } else {
                alert("Wrong answer! Try again.");
            }
        });

        modal.appendChild(button);
    });

    document.body.appendChild(modal);
}

// Function to show "Congratulations" modal
function showCongratulations() {
    let modal = document.createElement('div');
    modal.id = "congratsModal";
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'green';
    modal.style.color = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.3)';
    modal.style.zIndex = '1000';
    modal.style.textAlign = 'center';

    let congratsText = document.createElement('p');
    congratsText.innerText = "🎉 Congratulations! 🎉";
    modal.appendChild(congratsText);

    let closeButton = document.createElement('button');
    closeButton.innerText = "Close";
    closeButton.style.margin = '10px';
    closeButton.style.padding = '10px';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.background = '#fff';
    closeButton.style.color = 'black';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}
