const API_KEY = "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";

chrome.contextMenus.create({
  title: 'EZ Apply with ChatGPT',
  id: 'CGPT_ROOT',
  contexts: ['selection'],
});

chrome.contextMenus.create({
  title: 'Get a response',
  id: 'CGPT_ROOT_MAIN',
  contexts: ['selection'],
  parentId: 'CGPT_ROOT',
});

chrome.contextMenus.create({
  title: 'Paraphrase',
  id: 'CGPT_ROOT_PARA',
  contexts: ['selection'],
  parentId: 'CGPT_ROOT',
});

chrome.contextMenus.onClicked.addListener(runChatGpt);

function getSelection() {
  return window.getSelection().toString();
}

async function runChatGpt(info, tab) {
  const isOptionGetResponse = info.menuItemId == 'CGPT_ROOT_MAIN';

  let selected_text = "";
  try {
    var content = await chrome.scripting.executeScript({
      target: {
        tabId: tab.id
      },
      func: getSelection,
    });
    selected_text = content[0].result;
  } catch (e) {
    console.log("Using fallback method to get selected text!\n" + e.message);
    selected_text = info.selectionText;
  }

  chrome.storage.local.get('profile', (profileData) => {
    let promptMessage;

    if (!profileData || !profileData.profile) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "profile_not_filled" });
      });
      return;
    }

    if (isOptionGetResponse)
      promptMessage = `Write a response to "${selected_text}" for a student of name "${profileData.profile.name}" pursuing a ${profileData.profile.gradDegree} at ${profileData.profile.gradSchool} in ${profileData.profile.gradBranch} with a GPA of ${profileData.profile.gradGpa}. This student has ${profileData.profile.experience} years of experience at ${profileData.profile.organizations}. The student has worked on technologies such as ${profileData.profile.technologies} and has interests in ${profileData.profile.interests}.`;
    else
      promptMessage = `Paraphrase: ${selected_text}.`;

    console.log('Message to ChatGPT: ', promptMessage);

    fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: promptMessage,
        temperature: 0.4,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + API_KEY
      }
    })
      .then(data => data.json())
      .then(jsonedData => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { type: isOptionGetResponse ? "get_response" : "paraphrase", data: jsonedData });
        });
      });
  });

  // const tag = info.menuItemId.includes('#') ? info.menuItemId.substring(info.menuItemId.indexOf('#')) : null;
  // data[note_id] = {
  //   url: info.pageUrl,
  //   text: selected_text,
  //   comments: tag,
  //   tags: [tag]
  // };
}
