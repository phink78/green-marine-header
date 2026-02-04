import wixWindow from 'wix-window';

$w.onReady(function () {
  // ---------- Responsive Detection ----------
  const isMobile = wixWindow.formFactor === "Mobile";
  const isTablet = wixWindow.formFactor === "Tablet";
  
  // ---------- Design Tokens ----------
  const colors = {
    white: '#FFFFFF',
    primary: '#2E7D6B',
    textMain: '#111111',
    textMuted: '#666666',
    border: '#E3E6E5',
    badgeBg: '#F7F8F7',
    starGold: '#F4B400'
  };

  // ---------- Header Styling ----------
  function applyHeaderStyles() {
    const headerHeight = isMobile ? 64 : 72;
    const logoHeight = isMobile ? 24 : 28;

    // Header container
    try {
      const header = $w('#boxStickyHeader');
      if (header.length > 0) {
        header.style.backgroundColor = colors.white;
        header.style.borderBottom = `1px solid ${colors.border}`;
        header.style.height = `${headerHeight}px`;
      }
    } catch (e) {
      // Sticky header doesn't exist on this page
    }

    // Header inner (max width container)
    try {
      const headerInner = $w('#boxHeaderInner');
      if (headerInner.length > 0) {
        headerInner.style.maxWidth = '1200px';
        headerInner.style.padding = '0 20px';
      }
    } catch (e) {
      // Header inner doesn't exist on this page
    }

    // Logo
    try {
      const logo = $w('#imgLogo');
      if (logo.length > 0) {
        logo.style.height = `${logoHeight}px`;
      }
    } catch (e) {
      // Logo doesn't exist on this page
    }

    // Desktop menu
    try {
      if (isMobile) {
        $w('#boxMainMenu').hide();
      } else {
        $w('#boxMainMenu').show();
      }
    } catch (e) {
      // Main menu doesn't exist on this page
    }

    // Mobile CTA text
    try {
      const callLine = $w('#txtHeaderCallLine');
      if (callLine.length > 0) {
        if (isMobile) {
          callLine.show();
          callLine.style.fontSize = '14px';
          callLine.style.fontWeight = '600';
          callLine.style.color = colors.primary;
        } else {
          callLine.hide();
        }
      }
    } catch (e) {
      // Header call line doesn't exist on this page
    }

    // Call button (desktop)
    try {
      const callBtn = $w('#btnCallHeader');
      if (callBtn.length > 0) {
        if (isMobile) {
          callBtn.hide();
        } else {
          callBtn.show();
          callBtn.style.backgroundColor = colors.primary;
          callBtn.style.color = colors.white;
          callBtn.style.height = '44px';
          callBtn.style.borderRadius = '12px';
        }
      }
    } catch (e) {
      // Call button doesn't exist on this page
    }

    // Hamburger (mobile)
    try {
      if (isMobile) {
        $w('#btnHamburger').show();
      } else {
        $w('#btnHamburger').hide();
      }
    } catch (e) {
      // Hamburger doesn't exist on this page
    }

    // Language dropdown
    try {
      if (isMobile) {
        $w('#ddLanguage').hide();
      } else {
        $w('#ddLanguage').show();
      }
    } catch (e) {
      // Language dropdown doesn't exist on this page
    }
  }

  // ---------- USP Row Styling ----------
  function applyUSPStyles() {
    const badgeHeight = isMobile ? 38 : 40;
    const rowPadding = isMobile ? '10px 0' : '14px 0';

    // USP Row container
    try {
      const uspRow = $w('#boxUSPRow');
      if (uspRow.length > 0) {
        uspRow.style.backgroundColor = colors.white;
        uspRow.style.borderBottom = `1px solid ${colors.border}`;
        uspRow.style.padding = rowPadding;
      }
    } catch (e) {
      // USP Row doesn't exist on this page
    }

    // USP Inner container
    try {
      const uspInner = $w('#boxUSPInner');
      if (uspInner.length > 0) {
        uspInner.style.maxWidth = '1200px';
        uspInner.style.padding = '0 20px';
      }
    } catch (e) {
      // USP Inner doesn't exist on this page
    }

    // Apply badge styling to all 3 USP badges
    const badges = ['#badgeKrachtig', '#badgeFluisterstil', '#badgeGarantie'];

    badges.forEach(badgeId => {
      try {
        const badge = $w(badgeId);
        if (badge.length > 0) {
          badge.style.height = `${badgeHeight}px`;
          badge.style.borderRadius = '999px';
          badge.style.border = `1px solid ${colors.border}`;
          badge.style.backgroundColor = colors.badgeBg;
        }
      } catch (e) {
        // Badge doesn't exist on this page
      }
    });

    // Badge text styling
    const badgeTexts = ['#txtKrachtig', '#txtFluisterstil', '#txtGarantie'];

    badgeTexts.forEach(textId => {
      try {
        const text = $w(textId);
        if (text.length > 0) {
          text.style.fontSize = '14px';
          text.style.fontWeight = '600';
          text.style.color = colors.textMain;
        }
      } catch (e) {
        // Badge text doesn't exist on this page
      }
    });

    // Badge icon styling (18px each)
    const badgeIcons = ['#iconKrachtig', '#iconFluisterstil', '#iconGarantie'];

    badgeIcons.forEach(iconId => {
      try {
        const icon = $w(iconId);
        if (icon.length > 0) {
          icon.style.width = '18px';
          icon.style.height = '18px';
        }
      } catch (e) {
        // Badge icon doesn't exist on this page
      }
    });
  }

  // ---------- Google Reviews Ticker ----------
  const reviewQuotes = [
    "Fluisterstil en direct krachtig.",
    "Installatie superstrak. Top service.",
    "Eerlijk advies, perfecte match.",
    "Betrouwbaar team, technisch sterk.",
    "Vaarbereik klopt precies met advies."
  ];
  
  let currentQuoteIndex = 0;

  function applyReviewsStyles() {
    // Reviews row container
    try {
      const ticker = $w('#boxReviewsTicker');
      if (ticker.length > 0) {
        ticker.style.backgroundColor = colors.white;
        ticker.style.borderBottom = `1px solid ${colors.border}`;
        ticker.style.padding = '12px 0';
      }
    } catch (e) {
      // Reviews ticker doesn't exist on this page
    }

    // Reviews inner container
    try {
      const reviewsInner = $w('#boxReviewsInner');
      if (reviewsInner.length > 0) {
        reviewsInner.style.maxWidth = '1200px';
        reviewsInner.style.padding = '0 20px';
      }
    } catch (e) {
      // Reviews inner doesn't exist on this page
    }

    // Rating text styling
    try {
      const rating = $w('#txtRating');
      if (rating.length > 0) {
        rating.style.fontSize = '15px';
        rating.style.fontWeight = '600';
        rating.style.color = colors.textMain;
      }
    } catch (e) {
      // Rating text doesn't exist on this page
    }

    // Review quote styling
    try {
      const quote = $w('#txtReviewQuote');
      if (quote.length > 0) {
        quote.style.fontSize = '15px';
        quote.style.fontWeight = '500';
        quote.style.color = colors.textMain;
        quote.style.fontStyle = 'italic';
      }
    } catch (e) {
      // Review quote doesn't exist on this page
    }
  }

  function startReviewsCarousel() {
    try {
      const quote = $w('#txtReviewQuote');
      if (quote.length > 0) {
        setInterval(() => {
          try {
            // Fade out (faster)
            quote.hide('fade', { duration: 300 });

            setTimeout(() => {
              try {
                // Change text
                currentQuoteIndex = (currentQuoteIndex + 1) % reviewQuotes.length;
                quote.text = reviewQuotes[currentQuoteIndex];

                // Fade in (faster)
                quote.show('fade', { duration: 300 });
              } catch (e) {
                // Review quote element not found
              }
            }, 350);
          } catch (e) {
            // Review quote element not found
          }
        }, 2800); // Faster rotation: every 2.8 seconds (tick-tick-tick)
      }
    } catch (e) {
      // Reviews carousel not available on this page
    }
  }

  // ---------- Menu Interactions ----------

  // Hamburger menu toggle
  try {
    $w('#btnHamburger').onClick(() => {
      try {
        $w('#boxMobileMenu').show('slide', { direction: 'right', duration: 300 });
      } catch (e) {
        console.log('Mobile menu box not found');
      }
    });
  } catch (e) {
    // Hamburger button doesn't exist on this page
  }

  // Close mobile menu
  try {
    $w('#btnCloseMobileMenu').onClick(() => {
      try {
        $w('#boxMobileMenu').hide('slide', { direction: 'right', duration: 300 });
      } catch (e) {
        console.log('Mobile menu box not found');
      }
    });
  } catch (e) {
    // Close button doesn't exist on this page
  }

  // Motor dropdown (desktop)
  try {
    $w('#boxDropdownMotor').hide();
  } catch (e) {
    // Motor dropdown doesn't exist on this page
  }

  // Service dropdown (desktop)
  try {
    $w('#boxDropdownService').hide();
  } catch (e) {
    // Service dropdown doesn't exist on this page
  }

  // Call button click
  try {
    $w('#btnCallHeader').onClick(() => {
      // Add your phone number here
      wixWindow.openLightbox('ContactLightbox');
    });
  } catch (e) {
    // Call button doesn't exist on this page
  }

  // Language dropdown change
  try {
    $w('#ddLanguage').onChange((event) => {
      const selectedLang = event.target.value;
      // Handle language change
      console.log('Language changed to:', selectedLang);
    });
  } catch (e) {
    // Language dropdown doesn't exist on this page
  }

  // ---------- Init ----------
  applyHeaderStyles();
  applyUSPStyles();
  applyReviewsStyles();
  startReviewsCarousel();

  // Hide mobile menu initially
  try {
    $w('#boxMobileMenu').hide();
  } catch (e) {
    // Mobile menu doesn't exist on this page
  }

  console.log('Green Marine header loaded', { formFactor: wixWindow.formFactor });
});

