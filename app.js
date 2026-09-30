<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>寶寶餵奶紀錄</title>

<style>

*{
    box-sizing:border-box;
}

body{
    margin:0;
    padding:15px;
    background:#FFF8F7;
    font-family:"Microsoft JhengHei",sans-serif;
    color:#333;
}

.container{
    max-width:700px;
    margin:auto;
}

h1{
    text-align:center;
    color:#D97986;
    margin-bottom:20px;
}

.summary{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
    margin-bottom:20px;
}

.summary-card{
    background:#FDEEEA;
    border-radius:20px;
    padding:18px;
    text-align:center;
}

.summary-title{
    color:#888;
    font-size:16px;
    margin-bottom:10px;
}

.summary-value{
    color:#D97986;
    font-size:38px;
    font-weight:bold;
}

.main-card{
    background:white;
    border-radius:25px;
    padding:20px;
    border:2px solid #F7DED8;
    box-shadow:0 2px 8px rgba(0,0,0,0.05);
}

.section-title{

    font-size:20px;
    font-weight:bold;
    margin:20px 0 10px;
}

.time-row{
    display:flex;
    gap:10px;
}

.time-display{
    flex:1;
    border:2px solid #F7DED8;
    border-radius:18px;
    padding:18px;
    text-align:center;
    font-size:28px;
    color:#1976D2;
    font-weight:bold;
}

.add-btn{

    width:110px;
    background:#DDE8B3;
    border:none;
    border-radius:18px;
    font-size:24px;
    font-weight:bold;
    color:#557030;
}

.type-buttons{
    display:flex;
    gap:10px;
}

.type-btn{

    flex:1;
    padding:18px;
    border-radius:18px;
    border:2px solid #F7DED8;
    background:white;
    font-size:20px;
    font-weight:bold;
}

.type-btn.active{
    background:#F5B4B0;
    color:white;
    border:none;
}

.milk-grid{

    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:10px;
    margin-bottom:15px;
}

.milk-btn{

    padding:15px;
    border-radius:15px;
    border:2px solid #F7DED8;
    background:white;
    color:#1976D2;
    font-size:28px;
    font-weight:bold;
}

.milk-btn.active{
    background:#FDEEEA;
}

input{

    width:100%;
    padding:18px;
    border-radius:18px;
    border:2px solid #F7DED8;
    font-size:22px;
}

.save-btn{

    width:100%;
    margin-top:25px;
    padding:22px;
    background:#F5B4B0;
    color:white;
    border:none;
    border-radius:35px;
    font-size:30px;
    font-weight:bold;
}

.record-card{

    margin-top:20px;
    background:white;
    border-radius:20px;
    padding:20px;
    border:2px solid #F7DED8;
}

#recordsContainer{

    margin-top:10px;
}

.record{

    padding:12px;
    border-bottom:1px solid #eee;
}

.record:last-child{
    border-bottom:none;
}

@media(max-width:480px){

    .summary-value{
        font-size:30px;
    }

    .time-display{
        font-size:22px;
    }

    .milk-btn{
        font-size:22px;
    }
}

</style>
</head>

<body>

<div class="container">

<h1>🍼 寶寶餵奶紀錄</h1>

<div class="summary">

    <div class="summary-card">
        <div class="summary-title">
            距離上一餐已過
        </div>

        <div class="summary-value" id="lastInterval">
            --h --m
        </div>
    </div>

    <div class="summary-card">
        <div class="summary-title">
            上一餐實際喝量
        </div>

        <div class="summary-value" id="lastDrinkAmount">
            -- ml
        </div>
    </div>

</div>

<div class="main-card">

    <div class="section-title">
        ⏰ 餵奶時間
    </div>

    <div class="time-row">

        <div
            class="time-display"
            id="displayTime">
            讀取中...
        </div>

        <button
            class="add-btn"
            type="button"
            id="add5min">
            +5分鐘
        </button>

    </div>

    <input
        type="hidden"
        id="feedTime">

    <div class="section-title">
        🍼 餵奶方式
    </div>

    <div class="type-buttons">

        <button
            class="type-btn active"
            data-type="配方奶">
            配方奶
        </button>

        <button
            class="type-btn"
            data-type="瓶餵母奶">
            瓶餵母奶
        </button>

        <button
            class="type-btn"
            data-type="親餵">
            親餵
        </button>

    </div>

    <input
        type="hidden"
        id="feedType"
        value="配方奶">

    <div class="section-title">
        🥛 準備奶量（ml）
    </div>

    <div class="milk-grid">

        <button class="milk-btn" data-ml="90">90</button>
        <button class="milk-btn" data-ml="120">120</button>
        <button class="milk-btn" data-ml="150">150</button>
        <button class="milk-btn" data-ml="180">180</button>

    </div>

    <input
        type="number"
        id="preparedAmount"
        placeholder="自訂奶量">

    <div class="section-title">
        🍼 剩餘量（ml）
    </div>

    <input
        type="number"
        id="remainingAmount"
        placeholder="輸入剩餘量">

    <button
        class="save-btn"
        id="saveBtn">
        ✨ 紀錄這餐
    </button>

</div>

<div class="record-card">

    <h2>📜 最近餵奶紀錄</h2>

    <div id="recordsContainer">
        載入中...
    </div>

</div>

</div>

<script>

document.querySelectorAll(".type-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .querySelectorAll(".type-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        document
        .getElementById("feedType")
        .value =
        btn.dataset.type;
    });
});

document.querySelectorAll(".milk-btn")
.forEach(btn=>{

    btn.addEventListener("click",()=>{

        document
        .getElementById("preparedAmount")
        .value =
        btn.dataset.ml;

        document
        .querySelectorAll(".milk-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");
    });
});

</script>

<!-- 保持原順序 -->
<script src="config.js"></script>
<script src="app.js"></script>

</body>
</html>
