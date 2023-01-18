document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        chrome.storage.local.get('profile', (profileData) => {
            if (!profileData || !profileData.profile) return;

            document.getElementById('name').value = profileData.profile.name;
            document.getElementById('grad-degree').value = profileData.profile.gradDegree;
            document.getElementById('grad-school').value = profileData.profile.gradSchool;
            document.getElementById('grad-branch').value = profileData.profile.gradBranch;
            document.getElementById('grad-gpa').value = profileData.profile.gradGpa;
            document.getElementById('experience').value = profileData.profile.experience;
            document.getElementById('organizations').value = profileData.profile.organizations;
            document.getElementById('technologies').value = profileData.profile.technologies;
            document.getElementById('interests').value = profileData.profile.interests;
        });
    }
};

document.getElementById("save-button").addEventListener("click", saveProfile);

function saveProfile() {
    const name = document.getElementById('name').value;
    const gradDegree = document.getElementById('grad-degree').value;
    const gradSchool = document.getElementById('grad-school').value;
    const gradBranch = document.getElementById('grad-branch').value;
    const gradGpa = document.getElementById('grad-gpa').value;
    const experience = document.getElementById('experience').value;
    const organizations = document.getElementById('organizations').value;
    const technologies = document.getElementById('technologies').value;
    const interests = document.getElementById('interests').value;

    const data = {
        'profile': {
            name, gradDegree, gradSchool, gradBranch, gradGpa, experience, organizations, technologies, interests
        }
    };

    chrome.storage.local.set(data, () => alert('Profile saved!'));
}