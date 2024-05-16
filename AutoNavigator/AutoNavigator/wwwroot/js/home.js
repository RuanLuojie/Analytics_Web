document.addEventListener('DOMContentLoaded', function() {
    let optionsMap = {};

    // 发出 GET 请求获取选项数据
    fetch('https://nova-leather-hardhat.glitch.me/api/options')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateSelect('cpu', data.cpu);
            populateSelect('gpu', data.gpu);
            populateSelect('ram', data.ram);
            populateSelect('hdd', data.hdd);
        })
        .catch(error => {
            console.error('Error fetching options:', error);
            showError('伺服器未連線請重新整理網頁');
        });

    // 监听选择变化事件并显示结果
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', showResult);
    });

    // 填充下拉菜单的函数
    function populateSelect(id, options) {
        const select = document.getElementById(id);
        optionsMap[id] = {};

        options.forEach(option => {
            const parts = option.split(':');
            const displayText = parts[0];
            const valueText = parts.length > 1 ? parts[1] : parts[0];
            
            // 将前缀与完整值映射到 optionsMap 中
            optionsMap[id][displayText] = valueText;

            const opt = document.createElement('option');
            opt.value = displayText;
            opt.textContent = displayText;
            select.appendChild(opt);
        });
    }

    // 显示结果的函数
    function showResult() {
        const cpu = document.getElementById("cpu").value;
        const gpu = document.getElementById("gpu").value;
        const ram = document.getElementById("ram").value;
        const hdd = document.getElementById("hdd").value;

        // 获取映射后的完整值
        const cpuValue = cpu !== "choose" ? `CPU: ${optionsMap["cpu"][cpu]}` : null;
        const gpuValue = gpu !== "choose" ? `GPU: ${optionsMap["gpu"][gpu]}` : null;
        const ramValue = ram !== "choose" ? `RAM: ${optionsMap["ram"][ram]}` : null;
        const hddValue = hdd !== "choose" ? `HDD/SSD: ${optionsMap["hdd"][hdd]}` : null;

        // 创建结果数组
        let resultArray = [cpuValue, gpuValue, ramValue, hddValue].filter(value => value !== null);

        // 生成结果文本
        let resultText = ` ${resultArray.join(', ')}`;
        
        document.getElementById("result").innerText = resultText;
    }

    // 显示错误消息的函数
    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
});
