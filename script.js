const URL = "https://www.reddit.com/r/FlutterDev/";

const title = document.getElementById('title');
const info = document.getElementById('information');
const storeBtn = document.getElementById('store');
const tabs = document.querySelectorAll('.tab-content');

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
firebase.initializeApp(firebaseConfig);
let currentData = '';

storeBtn.addEventListener('click', function() {storeData();});

function loadData(tabId) {
    const selectedTab = document.getElementById(tabId);
    info.style.display = 'block';
    storeBtn.style.display = 'none';
    tabs.forEach(tab => tab.style.display = 'none');
    selectedTab.style.display = 'block';
    title.innerHTML = '/r/FlutterDev/'+tabId;

    fetch(URL+tabId+".json")
        .then(response => response.json())
        .then(data => { 
            try { data = data.data.children; } 
            catch (error) {
                info.innerHTML = 'Error loading data.';
                return;
            }
            selectedTab.innerHTML = '';
            data.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.addEventListener('click', () => window.open(item.data.url, '_blank'));
                card.innerHTML = `<p class="card-title">${item.data.title}</p>
                    <p class="card-desc">${item.data.selftext}</p>`;
                selectedTab.appendChild(card);
            });
            currentData = data;
            info.style.display = 'none';
            storeBtn.style.display = 'block';
        })
        .catch(error => { 
            console.error('Error fetching data:', error);
        });
}

function storeData() {
    const database = firebase.database();
    let obj = {time: new Date().toLocaleString(), data: currentData};
    database.ref('userData').push(obj);
    alert('Data has been saved successfully');
}
