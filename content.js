chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type == "get_response") {
        navigator.clipboard.writeText(message.data.choices[0].text.trim()).then(() => {
            alert('Text copied!');
        }, () => {
            alert('Oops! That failed :(');
        });
    } else if (message.type == "paraphrase") {
        document.activeElement.value = message.data.choices[0].text.trim();
    } else if (message.type == "profile_not_filled") {
        alert('Please fill out your profile information first!\nYou can do so by right-clicking the extension and then "Options".')
    }
});

document.addEventListener('keypress', e => {
    if (e.shiftKey && e.code == 'KeyZ') {
        alert('Hey!');
    }
});

/**
 * document.querySelector('[data-automation-id="formField-skillsPrompt"]').getElementsByTagName('input')[0].click();
 * document.querySelector('[data-automation-id="formField-skillsPrompt"]').getElementsByTagName('input')[0].value = "kafka";
 */