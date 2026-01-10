document.addEventListener("DOMContentLoaded", () => {
  const embeds = document.querySelectorAll(".privacy-embed");

  embeds.forEach(embed => {
    const provider = embed.dataset.provider || "youtube";
    const videoId = embed.dataset.id;
    const consentKey = "consent-" + provider + "-" + videoId;

    // If consent is already given → directly load the embed
    if (localStorage.getItem(consentKey) === "true") {
      loadEmbed(embed, provider, videoId, false);
    }

    // Attach listener to Accept button if present
    const acceptButton = embed.querySelector(".privacy-accept");
    if (acceptButton) {
      acceptButton.addEventListener("click", () => {
        localStorage.setItem(consentKey, "true");
        loadEmbed(embed, provider, videoId, true);
      });
    }
  });

  function loadEmbed(embed, provider, videoId, autoplay) {
    let src = "";

    if (provider === "youtube") {
      src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      if (autoplay) {
        src += `?autoplay=1&mute=1`;
      }
    }

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");

    embed.replaceWith(iframe);
  }
});