var player;

function createYouTubePlayer() {
    var playerDiv = document.getElementById("player");

    // Captura o atributo data-video do primeiro elemento com a classe "item video"
    var videoItem = document.querySelector(".item.video");
    if (!videoItem) {
        console.error("Elemento com .item.video não encontrado!");
        return;
    }

    var videoId = videoItem.getAttribute("data-video");
    if (!videoId) {
        console.error("ID do vídeo não encontrado no atributo data-video!");
        return;
    }

    // Se já houver um iframe, evita recriação
    if (!document.getElementById("youtube-iframe")) {
        var iframe = document.createElement("iframe");
        iframe.id = "youtube-iframe";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`; // Habilita API
        iframe.style.width = "100%";
        iframe.style.height = "100%";

        playerDiv.appendChild(iframe);
    }

    // Aguarda a API do YouTube estar pronta
    window.onYouTubeIframeAPIReady = function () {
        initializeYouTubePlayer();
    };
}

function initializeYouTubePlayer() {
    player = new YT.Player("youtube-iframe", {
        events: {
            "onReady": function (event) {
                console.log("YouTube Player pronto!");

                // Pausar o vídeo ao sair da aba
                document.addEventListener("visibilitychange", function () {
                    if (document.hidden && player && player.pauseVideo) {
                        player.pauseVideo();
                    }
                });

                // Ajustar o tamanho do vídeo dinamicamente
                resizeVideo();
                window.addEventListener("resize", resizeVideo);
            }
        }
    });
}

// Ajusta o tamanho do vídeo para ocupar toda a largura do container mantendo proporção 16:9
function resizeVideo() {
    var playerDiv = document.getElementById("player");
    var iframe = document.getElementById("youtube-iframe");

    if (playerDiv && iframe) {
        var width = playerDiv.clientWidth;
        var height = (width * 9) / 16;

        iframe.style.width = width + "px";
        iframe.style.height = height + "px";
    }
}

// Carrega a API do YouTube
(function () {
    var script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
})();

// Aguarda o carregamento da página antes de inicializar o player
document.addEventListener("DOMContentLoaded", function () {
    createYouTubePlayer();
});
