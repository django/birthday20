document.addEventListener("DOMContentLoaded", () => {
  const embeds = document.querySelectorAll(".privacy-embed");

  // consent check

  embeds.forEach(embed => {
    const provider = embed.dataset.provider || "youtube";
    const videoId = embed.dataset.id;
    const consentKey = "consent-" + provider + "-" + videoId;

    // If consent is already given → directly load the embed
    if (localStorage.getItem(consentKey) === "true") {
      loadEmbed(embed, provider, videoId, false);
    } else {
      showPlaceholder(embed, provider, videoId, consentKey);
    }
  });

  // It displays a placeholder before loading the actual embed
  function showPlaceholder(embed, provider, videoId, consentKey) {
    const thumbnail = embed.dataset.thumbnail || (provider === "youtube" 
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "https://via.placeholder.com/480x270?text=Preview");

    embed.innerHTML = `
      <div class="privacy-placeholder">
        <img src="${thumbnail}" alt="${provider} preview" />
        <p>
          By playing this ${provider} embed you accept
          <a href="https://policies.google.com/privacy" target="_blank">privacy policy</a>.
        </p>
        <button class="privacy-accept">Accept & Play</button>
      </div>
    `;

    embed.querySelector(".privacy-accept").addEventListener("click", () => {
      localStorage.setItem(consentKey, "true");
      loadEmbed(embed, provider, videoId, true);
    });
  }

  // Actual iframe is loaded 
  function loadEmbed(embed, provider, videoId, autoplay) {
    let src = "";

    if (provider === "youtube") {
      src = `https://www.youtube-nocookie.com/embed/${videoId}`;
      if (autoplay) {
        src += `?autoplay=1`;
      }
    }

    embed.outerHTML = `
      <iframe 
        src="${src}" 
        frameborder="0" 
        allowfullscreen
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
      </iframe>
    `;
  }
});