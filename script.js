const stars = document.querySelectorAll('#star');


let result = 0;

stars.forEach((item,index) => {
item.addEventListener("click",() => {
    console.log('you have clicked on a star: ',index + 1);
    result = index + 1; 
    UpdateDiv();
});
});

const UpdateDiv = ()=>{
console.log('hii line 15');
    stars.forEach((item,index) => {
if (index < result) item.classList.add('active');
else item.classList.remove('active');
});
document.querySelector("#result").textContent = `${result}/5`;

};

function openNav() {
  document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

let activeCategory = 'all';
    let searchQuery = '';

    function applyFilters() {
      document.querySelectorAll('.card').forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const matchesCategory = activeCategory === 'all' || category === activeCategory;
        const matchesSearch = name.includes(searchQuery.toLowerCase());

        card.classList.toggle('hidden', !(matchesCategory && matchesSearch));
      });
    }

    // Category buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.filter;
        applyFilters();
      });
    });

    const APPS_SCRIPT_URL = "YOUR_WEB_APP_URL_HERE"; // paste your deployed URL
  const MAX_SIZE_MB = 5;

  const dropZone   = document.getElementById("drop-zone");
  const fileInput  = document.getElementById("file-input");
  const preview    = document.getElementById("preview");
  const previewImg = document.getElementById("preview-img");
  const fileName   = document.getElementById("file-name");
  const removeBtn  = document.getElementById("remove-btn");
  const submitBtn  = document.getElementById("submit-btn");
  const btnText    = document.getElementById("btn-text");
  const spinner    = document.getElementById("spinner");
  const status     = document.getElementById("status");

  let base64Image = null;

  dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("dragover"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

  function handleFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showStatus("Please upload an image file.", "error"); return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showStatus(`Image must be under ${MAX_SIZE_MB}MB.`, "error"); return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      base64Image = e.target.result; // full base64 data URL
      previewImg.src = base64Image;
      fileName.textContent = file.name;
      preview.style.display = "block";
      dropZone.style.display = "none";
      submitBtn.disabled = false;
      btnText.textContent = "Submit Image";
    };
    reader.readAsDataURL(file);
  }

  removeBtn.addEventListener("click", () => {
    base64Image = null;
    fileInput.value = "";
    preview.style.display = "none";
    dropZone.style.display = "block";
    submitBtn.disabled = true;
    btnText.textContent = "Select an image to submit";
    status.style.display = "none";
  });

  submitBtn.addEventListener("click", async () => {
    const name  = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) { showStatus("Please fill in all fields.", "error"); return; }
    if (!base64Image)    { showStatus("Please select an image.", "error"); return; }

    setLoading(true);

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ name, email, imageUrl: base64Image })
      });

      const data = await res.json();
      if (data.success) {
        showStatus("✅ Image submitted successfully!", "success");
      } else {
        showStatus("Something went wrong. Please try again.", "error");
      }
    } catch (err) {
      showStatus("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });

  function setLoading(loading) {
    submitBtn.disabled = loading;
    spinner.style.display = loading ? "block" : "none";
    btnText.textContent = loading ? "Submitting..." : "Submit Image";
  }

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = type;
    status.style.display = "block";
  }