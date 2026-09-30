console.log("app.js 已載入");

const recordsContainer = document.getElementById("recordsContainer");
const saveBtn = document.getElementById("saveBtn");

document.addEventListener("DOMContentLoaded", () => {

    console.log("DOM 已載入");

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    document.getElementById("feedTime").value =
        now.toISOString().slice(0,16);

    loadRecords();

});

saveBtn.addEventListener("click", saveRecord);

async function loadRecords(){

    try{

        console.log("開始載入歷史紀錄");

        const response = await fetch(
            `${window.CONFIG.GAS_URL}?action=get`
        );

        const data = await response.json();

        console.log("取得資料成功", data);

        localStorage.setItem(
            "babyFeedRecords",
            JSON.stringify(data)
        );

        renderRecords(data);

    }
    catch(error){

        console.error("載入失敗", error);

        const cache =
            localStorage.getItem("babyFeedRecords");

        if(cache){

            console.log("使用本機快取");

            renderRecords(JSON.parse(cache));
        }

        else{

            recordsContainer.innerHTML =
                "<p>資料載入失敗</p>";
        }
    }
}

function renderRecords(records){

    if(!records || records.length === 0){

        recordsContainer.innerHTML =
            "<p>目前沒有紀錄</p>";

        return;
    }

    recordsContainer.innerHTML = records.map(item => {

        return `
        <div class="record">
            <div><strong>${item.feedTime}</strong></div>
            <div>${item.feedType}</div>
            <div>
                準備量：${item.preparedAmount} ml
            </div>
            <div>
                剩餘量：${item.remainingAmount} ml
            </div>
            <div>
                實際飲用：
                ${(item.preparedAmount||0)-(item.remainingAmount||0)} ml
            </div>
        </div>
        `;

    }).join("");

}

async function saveRecord(){

    try{

        const payload = {

            feedTime:
                document.getElementById("feedTime").value,

            feedType:
                document.getElementById("feedType").value,

            preparedAmount:
                Number(
                    document.getElementById(
                        "preparedAmount"
                    ).value
                ),

            remainingAmount:
                Number(
                    document.getElementById(
                        "remainingAmount"
                    ).value
                )
        };

        console.log("準備送出", payload);

        await fetch(window.CONFIG.GAS_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain"
            },

            body: JSON.stringify(payload)

        });

        console.log("寫入成功");

        alert("✅ 紀錄成功");

        document.getElementById(
            "preparedAmount"
        ).value = "";

        document.getElementById(
            "remainingAmount"
        ).value = "";

        await loadRecords();

    }
    catch(error){

        console.error("寫入失敗", error);

        alert(
            "❌ 寫入失敗，請打開 F12 查看錯誤訊息"
        );
    }
}
