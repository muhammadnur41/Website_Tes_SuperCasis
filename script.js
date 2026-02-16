// --- DATA TETAP SAMA ---
const psikotesItems = [];
for (let i = 1; i <= 20; i++) {
    psikotesItems.push({
        id: i,
        name: `Psikotes ${i}`,
        file: `psikotes/psikotes${i}.html`,
        icon: 'fa-brain',
        color: getRandomColor(i)
    });
}

const akademikCategories = {
    matematika: { title: 'Matematika', prefix: 'matematika', folder: 'matematika', icon: 'fa-calculator', color: '#FAD961', items: [] },
    inggris: { title: 'Bahasa Inggris', prefix: 'inggris', folder: 'bahasa-inggris', icon: 'fa-language', color: '#00C9FF', items: [] },
    umum: { title: 'Pengetahuan Umum', prefix: 'umum', folder: 'pengetahuan-umum', icon: 'fa-globe', color: '#FF9A9E', items: [] },
    wawasan: { title: 'Wawasan Kebangsaan', prefix: 'wawasan', folder: 'wawasan-kebangsaan', icon: 'fa-flag-indonesia', color: '#A8EDEA', items: [] }
};

function getRandomColor(index) {
    const colors = ['#4158D0', '#C850C0', '#FFCC70', '#667eea', '#764ba2', '#f093fb', '#f5576c'];
    return colors[index % colors.length];
}

for (let category in akademikCategories) {
    for (let i = 1; i <= 20; i++) {
        akademikCategories[category].items.push({
            id: i,
            name: `${akademikCategories[category].title} ${i}`,
            file: `akademik/${akademikCategories[category].folder}/${akademikCategories[category].prefix}${i}.html`,
            icon: akademikCategories[category].icon,
            color: akademikCategories[category].color
        });
    }
}

// --- VARIABEL PELACAK MENU TERAKHIR ---
let lastActiveMenu = null; 

// --- MODIFIKASI FUNGSI NAVIGASI ---

function animateIn(element) {
    // Sembunyikan Header dan Menu Utama agar tampilan penuh ke atas
    document.querySelector('header').style.display = 'none';
    document.querySelector('.main-menu').style.display = 'none';
    
    element.style.display = 'block';
    element.style.animation = 'slideIn 0.4s ease-out';
    window.scrollTo(0, 0); 
}

function backToMain() {
    lastActiveMenu = null; // Reset pelacak saat kembali ke menu utama
    document.querySelector('header').style.display = 'block';
    document.querySelector('.main-menu').style.display = 'block';
    
    animateOut(document.getElementById('psikotesMenu'));
    animateOut(document.getElementById('akademikMenu'));
    animateOut(document.getElementById('categoryDetailMenu'));
    animateOut(document.getElementById('testFrame'));
    
    setTimeout(() => {
        document.getElementById('psikotesMenu').style.display = 'none';
        document.getElementById('akademikMenu').style.display = 'none';
        document.getElementById('categoryDetailMenu').style.display = 'none';
        document.getElementById('testFrame').style.display = 'none';
    }, 300);
}

function openTest(title, filePath) {
    // Sembunyikan daftar menu sebelum membuka frame tes
    if (lastActiveMenu) {
        document.getElementById(lastActiveMenu).style.display = 'none';
    }
    
    document.getElementById('testTitle').textContent = title;
    document.getElementById('testIframe').src = filePath;
    
    animateIn(document.getElementById('testFrame'));
    
    if (typeof startTimer === "function") startTimer();
    if (typeof showToast === "function") showToast(`Memulai tes: ${title}`, 'success');
}

// PERBAIKAN: Fungsi Tutup Tes Kembali ke Menu Sebelumnya
function closeTest() {
    animateOut(document.getElementById('testFrame'));
    
    setTimeout(() => {
        document.getElementById('testFrame').style.display = 'none';
        document.getElementById('testIframe').src = '';
        if (typeof stopTimer === "function") stopTimer();
        
        // Logika Kembali ke Menu Terakhir
        if (lastActiveMenu === 'psikotesMenu') {
            document.getElementById('psikotesMenu').style.display = 'block';
            document.getElementById('psikotesMenu').style.animation = 'slideIn 0.3s ease-out';
        } 
        else if (lastActiveMenu === 'categoryDetailMenu') {
            document.getElementById('categoryDetailMenu').style.display = 'block';
            document.getElementById('categoryDetailMenu').style.animation = 'slideIn 0.3s ease-out';
        } 
        else {
            backToMain();
        }
    }, 300);
    
    if (typeof showToast === "function") showToast('Tes ditutup', 'info');
}

function backToAkademik() {
    lastActiveMenu = 'akademikMenu'; // Ubah status ke menu kategori utama
    document.getElementById('akademikMenu').style.display = 'block';
    animateOut(document.getElementById('categoryDetailMenu'));
    
    setTimeout(() => {
        document.getElementById('categoryDetailMenu').style.display = 'none';
    }, 300);
}

// --- FUNGSI PENDUKUNG ---

function showPsikotesMenu() {
    lastActiveMenu = 'psikotesMenu'; // Simpan status
    animateIn(document.getElementById('psikotesMenu'));
    document.getElementById('akademikMenu').style.display = 'none';
    
    const grid = document.getElementById('psikotesGrid');
    grid.innerHTML = '';
    
    psikotesItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'test-item';
        div.style.animationDelay = `${index * 0.05}s`;
        div.innerHTML = `<i class="fas ${item.icon}" style="font-size: 24px; margin-bottom: 10px; display: block;"></i> ${item.name}`;
        div.onclick = () => openTest(item.name, item.file);
        grid.appendChild(div);
    });
}

function showAkademikMenu() {
    lastActiveMenu = 'akademikMenu'; // Simpan status
    animateIn(document.getElementById('akademikMenu'));
    document.getElementById('psikotesMenu').style.display = 'none';
}

function showCategory(category) {
    lastActiveMenu = 'categoryDetailMenu'; // Simpan status
    animateIn(document.getElementById('categoryDetailMenu'));
    document.getElementById('akademikMenu').style.display = 'none';
    
    const categoryData = akademikCategories[category];
    document.getElementById('categoryTitle').innerHTML = `<i class="fas ${categoryData.icon}"></i> Pilih Tes ${categoryData.title}`;
    
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';
    
    categoryData.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'test-item';
        div.style.background = `linear-gradient(135deg, ${categoryData.color}22 0%, ${categoryData.color}44 100%)`;
        div.innerHTML = `<i class="fas ${categoryData.icon}" style="color: ${categoryData.color};"></i> ${item.name}`;
        div.onclick = () => openTest(item.name, item.file);
        grid.appendChild(div);
    });
}

function animateOut(element) {
    if (element && element.style.display !== 'none') {
        element.style.animation = 'slideOut 0.3s ease-out forwards';
    }
}