console.log("Baby Feed App Start");

let currentTime = new Date();
let latestRecord = null;

document.addEventListener("DOMContentLoaded", () => {

    initTime();
    initTypeButtons();
    initMilkButtons();
    initRemainButtons();

    document
        .getElementById("add5Btn")
        .addEventListener(
            "click",
            add5Minutes
        );

    document
        .getElementById("saveBtn")
        .addEventListener(
            "click",
            saveRecord
        );

    document
        .getElementById("updateRemainingBtn")
        .addEventListener(
            "click",
            updateRemaining
        );

    loadRecords();

});

function initTime(){

    currentTime = new Date();

    updateDisplayTime();

}

function updateDisplayTime(){

    document
        .getElementById("feedTime")
        .value =
        currentTime.toISOString();

    document
        .getElementById("displayTime")
        .innerText =
        currentTime.toLocaleString(
            "zh-TW",
            {
                timeZone:"Asia/Taipei",
                hour12:false
            }
        );

}

function add5Minutes(){

    currentTime.setMinutes(
        currentTime.getMinutes() + 5
    );

    updateDisplayTime();

}

function initTypeButtons(){

    document
        .querySelectorAll(".type-btn")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                document
                    .querySelectorAll(".type-btn")
                    .forEach(x=>
                        x.classList.remove("active")
                    );

                btn.classList.add("active");

                document
                    .getElementById("feedType")
                    .value =
                    btn.dataset.type;

            });

        });

}

function initMilkButtons(){

    document
        .querySelectorAll(".milk-btn")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                document
                    .querySelectorAll(".milk-btn")
                    .forEach(x=>
                        x.classList.remove("active")
                    );

                btn.classList.add("active");

                document
                    .getElementById("preparedAmount")
                    .value =
                    btn.dataset.ml;

            });

        });

}

function initRemainButtons(){

    document
        .querySelectorAll(".remain-btn")
        .forEach(btn=>{

            btn.addEventListener("click",()=>{

                document
                    .querySelectorAll(".remain-btn")
                    .forEach(x=>
                        x.classList.remove("active")
                    );

                btn.classList.add("active");

                document
                    .getElementById("remainingAmount")
                    .value =
                    btn.dataset.remain;

            });

        });

}

async function saveRecord(){

    try{

        const preparedAmount =
            Number(
                document
                    .getElementById("preparedAmount")
                    .value
            );

        if(!preparedAmount){

            alert("請輸入奶量");

            return;
        }

        const payload = {

            feedTime:
                document
                .getElementById("feedTime")
                .value,

            feedType:
                document
                .getElementById("feedType")
                .value,

            preparedAmount:

                preparedAmount,

            remainingAmount:0

        };

        console.log(
            "送出資料",
            payload
        );

        await fetch(
            window.CONFIG.GAS_URL,
            {
                method:"POST",

                headers:{
                    "Content-Type":"text/plain"
                },

                body:JSON.stringify(
                    payload
                )
            }
        );

        alert("✅ 已記錄");

        document
            .getElementById("preparedAmount")
            .value = "";

        document
            .querySelectorAll(".milk-btn")
            .forEach(x=>
                x.classList.remove("active")
            );

        currentTime =
            new Date();

        updateDisplayTime();

        loadRecords();

    }
    catch(error){

        console.error(error);

        alert("寫入失敗");

    }

}

async function updateRemaining(){

    try{

        if(!latestRecord){

            alert("尚無資料");

            return;
        }

        const remainingAmount =
        Number(
            document
            .getElementById(
                "remainingAmount"
            )
            .value
        );

        if(isNaN(remainingAmount)){

            alert("請輸入剩餘量");

            return;
        }

        const response =
        await fetch(

            `${window.CONFIG.GAS_URL}?action=updateRemaining`,

            {

                method:"POST",

                headers:{
                    "Content-Type":"text/plain"
                },

                body:JSON.stringify({

                    feedTime:
                        latestRecord.feedTime,

                    remainingAmount:
                        remainingAmount

                })

            }

        );

        const result =
        await response.json();

        console.log(result);

        alert("✅ 已更新");

        document
            .getElementById(
                "remainingAmount"
            )
            .value = "";

        document
            .querySelectorAll(".remain-btn")
            .forEach(x=>
                x.classList.remove("active")
            );

        loadRecords();

    }
    catch(error){

        console.error(error);

        alert("更新失敗");

    }

}

async function loadRecords(){

    try{

        const response =
        await fetch(
            window.CONFIG.GAS_URL
        );

        const records =
        await response.json();

        if(
            records &&
            records.length
        ){

            latestRecord =
                records[0];

            updateSummary(
                latestRecord
            );

            updateLastFeedInfo(
                latestRecord
            );

        }

        renderRecords(
            records || []
        );

    }
    catch(error){

        console.error(
            "載入失敗",
            error
        );

    }

}

function updateSummary(record){

    const feedTime =
        new Date(
            record.feedTime
        );

    const diff =
        Date.now()
        -
        feedTime.getTime();

    const h =
        Math.floor(
            diff /
            (1000 * 60 * 60)
        );

    const m =
        Math.floor(
            diff /
            (1000 * 60)
        ) % 60;

    document
        .getElementById(
            "lastInterval"
        )
        .innerText =
        `${h}h ${m}m`;

    const drinkAmount =

        (Number(
            record.preparedAmount
        ) || 0)

        -

        (Number(
            record.remainingAmount
        ) || 0);

    document
        .getElementById(
            "lastDrinkAmount"
        )
        .innerText =
        `${drinkAmount}ml`;

}

function updateLastFeedInfo(record){

    document
        .getElementById(
            "lastFeedInfo"
        )
        .innerHTML =

        `
        ${record.feedType}
        ｜準備 ${record.preparedAmount}ml
        <br>
        已填剩餘：${record.remainingAmount || 0}ml
        `;

}

function renderRecords(records){

    const container =
        document.getElementById(
            "recordsContainer"
        );

    if(
        !records ||
        records.length === 0
    ){

        container.innerHTML =
            "尚無資料";

        return;
    }

    container.innerHTML =

        records
        .slice(0,10)
        .map(r=>{

            const drinkAmount =

                (Number(
                    r.preparedAmount
                ) || 0)

                -

                (Number(
                    r.remainingAmount
                ) || 0);

            return `

            <div class="record">

                ${new Date(r.feedTime)
                .toLocaleString(
                    "zh-TW",
                    {
                        hour12:false
                    }
                )}

                ｜

                ${r.feedType}

                ｜

                ${drinkAmount}ml

            </div>

            `;

        })
        .join("");

}
