/**
 * ZeroBloat Bundles - Pure Vanilla JS (< 4.5KB)
 * Zero external libraries, maximum performance, dynamic stock checking & seamless Shopify Cart API integration.
 */

(function () {
  function initZeroBloatBundles() {
    const containers = document.querySelectorAll('.zerobloat-bundle-container');

    containers.forEach((container) => {
      if (container.dataset.initialized) return;
      container.dataset.initialized = 'true';

      const blockId = container.id.replace('zerobloat-bundle-', '');
      const productJsonElem = document.getElementById('zerobloat-product-json-' + blockId);
      const variantsContainer = document.getElementById('zerobloat-variants-' + blockId);
      const addBtn = document.getElementById('zerobloat-btn-' + blockId);
      const tierCards = container.querySelectorAll('.zerobloat-tier-card');

      const isProductAvailable = container.dataset.productAvailable === 'true';
      const defaultBtnText = container.dataset.btnText || 'Add Bundle to Cart';
      const soldOutText = container.dataset.soldOutText || 'Sold Out';
      const loadingText = container.dataset.loadingText || 'Adding Bundle...';
      const addedText = container.dataset.addedText || 'Added to Cart!';

      let productData = null;
      if (productJsonElem) {
        try {
          productData = JSON.parse(productJsonElem.textContent);
        } catch (e) {
          console.error('[ZeroBloat] Failed to parse product JSON', e);
        }
      }

      // Initialize Urgency Countdown Timer (if enabled)
      setupCountdownTimer(container, addBtn);

      // Handle Tier Switching
      tierCards.forEach((card) => {
        card.addEventListener('click', function () {
          tierCards.forEach((c) => c.classList.remove('active'));
          this.classList.add('active');

          const radio = this.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;

          renderVariantSelectors(this);
          checkBundleAvailability();
        });
      });

      function getActiveTier() {
        const activeCard = container.querySelector('.zerobloat-tier-card.active');
        if (!activeCard) return null;
        return {
          qty: parseInt(activeCard.dataset.qty || '1', 10),
          discount: parseInt(activeCard.dataset.discount || '0', 10),
          tier: activeCard.dataset.tier,
        };
      }

      // Extract unique option values per position (Option 1 = Size, Option 2 = Color, etc.)
      function getProductOptions() {
        if (!productData || !productData.variants || productData.variants.length === 0) return [];
        if (productData.has_only_default_variant) return [];

        let optionNames = [];
        if (Array.isArray(productData.options)) {
          optionNames = productData.options.map((opt) =>
            typeof opt === 'string' ? opt : opt.name || 'Option'
          );
        }

        // Detect total options from first variant
        const firstVar = productData.variants[0];
        const totalOptions = firstVar.options ? firstVar.options.length : (firstVar.option3 ? 3 : firstVar.option2 ? 2 : 1);

        const options = [];
        for (let i = 0; i < totalOptions; i++) {
          const name = optionNames[i] || `Option ${i + 1}`;
          const valuesSet = new Set();

          productData.variants.forEach((v) => {
            const val = v.options ? v.options[i] : v['option' + (i + 1)];
            if (val) valuesSet.add(val);
          });

          options.push({
            name: name,
            position: i,
            values: Array.from(valuesSet),
          });
        }

        return options;
      }

      // Find variant object matching the chosen option values
      function getMatchingVariant(selectedOptionValues) {
        if (!productData || !productData.variants) return null;

        const match = productData.variants.find((v) => {
          return selectedOptionValues.every((val, idx) => {
            const vVal = v.options ? v.options[idx] : v['option' + (idx + 1)];
            return vVal === val;
          });
        });

        return match || productData.variants[0];
      }

      function checkBundleAvailability() {
        if (!isProductAvailable || (productData && productData.available === false)) {
          if (addBtn) {
            addBtn.disabled = true;
            addBtn.classList.add('disabled');
            const textElem = addBtn.querySelector('.zerobloat-btn-text');
            if (textElem) textElem.textContent = soldOutText;
          }
          return false;
        }

        if (productData && !productData.has_only_default_variant && variantsContainer) {
          const activeTier = getActiveTier();
          const qty = activeTier ? activeTier.qty : 1;
          const options = getProductOptions();

          let anyUnavailable = false;

          for (let itemIdx = 1; itemIdx <= qty; itemIdx++) {
            const selectedValues = [];
            options.forEach((opt) => {
              const sel = variantsContainer.querySelector(
                `select[data-item="${itemIdx}"][data-opt-position="${opt.position}"]`
              );
              selectedValues.push(sel ? sel.value : opt.values[0]);
            });

            const matchedVar = getMatchingVariant(selectedValues);
            if (matchedVar && matchedVar.available === false) {
              anyUnavailable = true;
              break;
            }
          }

          if (anyUnavailable) {
            if (addBtn) {
              addBtn.disabled = true;
              addBtn.classList.add('disabled');
              const textElem = addBtn.querySelector('.zerobloat-btn-text');
              if (textElem) textElem.textContent = soldOutText;
            }
            return false;
          }
        }

        if (addBtn) {
          addBtn.disabled = false;
          addBtn.classList.remove('disabled');
          const textElem = addBtn.querySelector('.zerobloat-btn-text');
          if (textElem) textElem.textContent = defaultBtnText;
        }
        return true;
      }

      function renderVariantSelectors(card) {
        if (!variantsContainer || !productData || productData.has_only_default_variant) {
          if (variantsContainer) variantsContainer.style.display = 'none';
          return;
        }

        const options = getProductOptions();
        if (options.length === 0) {
          variantsContainer.style.display = 'none';
          return;
        }

        variantsContainer.style.display = 'flex';
        const qty = parseInt(card.dataset.qty || '1', 10);
        variantsContainer.innerHTML = '';

        for (let itemIdx = 1; itemIdx <= qty; itemIdx++) {
          const row = document.createElement('div');
          row.className = 'zerobloat-item-select-row';

          const label = document.createElement('span');
          label.className = 'zerobloat-item-label';
          const itemPrefix = container.dataset.itemPrefix || 'Item';
          label.textContent = `${itemPrefix} #${itemIdx}:`;
          row.appendChild(label);

          const selectGroup = document.createElement('div');
          selectGroup.className = 'zerobloat-select-group';

          options.forEach((opt) => {
            const select = document.createElement('select');
            select.className = 'zerobloat-select';
            select.dataset.item = itemIdx;
            select.dataset.optPosition = opt.position;
            select.setAttribute('aria-label', `${opt.name} for ${itemPrefix} #${itemIdx}`);

            opt.values.forEach((val) => {
              const optionElem = document.createElement('option');
              optionElem.value = val;
              optionElem.textContent = val;
              select.appendChild(optionElem);
            });

            select.addEventListener('change', () => {
              checkBundleAvailability();
            });

            selectGroup.appendChild(select);
          });

          row.appendChild(selectGroup);
          variantsContainer.appendChild(row);
        }
      }

      // Initial Variant Render for Active Tier & Initial Availability Check
      const initialActiveCard = container.querySelector('.zerobloat-tier-card.active');
      if (initialActiveCard) {
        renderVariantSelectors(initialActiveCard);
      }
      checkBundleAvailability();

      // Handle Add Bundle to Cart
      if (addBtn) {
        addBtn.addEventListener('click', async function (e) {
          e.preventDefault();

          if (addBtn.disabled || !checkBundleAvailability()) {
            return;
          }

          const activeTier = getActiveTier();
          if (!activeTier) return;

          addBtn.classList.add('loading');
          const btnTextElem = addBtn.querySelector('.zerobloat-btn-text');
          const originalText = btnTextElem ? btnTextElem.textContent : defaultBtnText;
          if (btnTextElem) btnTextElem.textContent = loadingText;

          let itemsToAdd = [];

          if (productData && !productData.has_only_default_variant && variantsContainer) {
            const options = getProductOptions();

            for (let itemIdx = 1; itemIdx <= activeTier.qty; itemIdx++) {
              const selectedValues = [];
              options.forEach((opt) => {
                const sel = variantsContainer.querySelector(
                  `select[data-item="${itemIdx}"][data-opt-position="${opt.position}"]`
                );
                selectedValues.push(sel ? sel.value : opt.values[0]);
              });

              const matchedVar = getMatchingVariant(selectedValues);
              const variantId = matchedVar ? matchedVar.id : productData.variants[0].id;

              itemsToAdd.push({
                id: variantId,
                quantity: 1,
                properties: {
                  _bundle_tier: activeTier.tier,
                  _bundle_discount: activeTier.discount + '%',
                },
              });
            }
          } else {
            const defaultVariantId = productData
              ? productData.variants[0].id
              : parseInt(container.dataset.productId, 10);

            itemsToAdd.push({
              id: defaultVariantId,
              quantity: activeTier.qty,
              properties: {
                _bundle_tier: activeTier.tier,
                _bundle_discount: activeTier.discount + '%',
              },
            });
          }

          try {
            const response = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: itemsToAdd }),
            });

            if (response.ok) {
              if (btnTextElem) btnTextElem.textContent = '✓ ' + addedText;

              // Publish cart update event for native theme cart drawers
              document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));

              // Redirect or show success
              setTimeout(() => {
                window.location.href = '/checkout';
              }, 400);
            } else {
              throw new Error('Cart API returned error');
            }
          } catch (err) {
            console.error('[ZeroBloat] Error adding bundle to cart:', err);
            if (btnTextElem) btnTextElem.textContent = originalText;
            addBtn.classList.remove('loading');
            alert('Could not add bundle to cart. Please try again.');
          }
        });
      }
    });
  }

  function setupCountdownTimer(container, addBtn) {
    const timerWrap = container.querySelector('.zerobloat-timer-wrap');
    if (!timerWrap) return;

    const timerType = timerWrap.dataset.timerType || 'evergreen';
    const timerDateStr = timerWrap.dataset.timerDate || '2026-12-31 23:59';
    const timerMinutes = parseInt(timerWrap.dataset.timerMinutes || '15', 10);
    const expiredAction = timerWrap.dataset.timerAction || 'hide';
    const expiredText = timerWrap.dataset.timerExpiredText || 'Offer Expired';

    const storageKey = 'zb_timer_' + (container.id || 'bundle');

    let targetTime = 0;
    if (timerType === 'fixed_date') {
      const parsed = new Date(timerDateStr.replace(' ', 'T')).getTime();
      targetTime = isNaN(parsed) ? Date.now() + 24 * 3600 * 1000 : parsed;
    } else {
      // Evergreen (Session-based)
      try {
        const isDesignMode = !!(window.Shopify && window.Shopify.designMode);
        const stored = localStorage.getItem(storageKey);
        const storedInt = stored ? parseInt(stored, 10) : NaN;
        if (!isDesignMode && !isNaN(storedInt) && storedInt > Date.now()) {
          targetTime = storedInt;
        } else {
          targetTime = Date.now() + timerMinutes * 60 * 1000;
          localStorage.setItem(storageKey, targetTime.toString());
        }
      } catch (e) {
        targetTime = Date.now() + timerMinutes * 60 * 1000;
      }
    }

    const daysBox = timerWrap.querySelector('.zb-timer-days');
    const daysSep = timerWrap.querySelector('.zb-timer-days-sep');
    const dElem = timerWrap.querySelector('.zb-d');
    const hElem = timerWrap.querySelector('.zb-h');
    const mElem = timerWrap.querySelector('.zb-m');
    const sElem = timerWrap.querySelector('.zb-s');
    const digitsWrap = timerWrap.querySelector('.zerobloat-timer-digits');

    function pad(n) {
      return n < 10 ? '0' + n : n.toString();
    }

    function onExpire() {
      if (window.Shopify && window.Shopify.designMode) {
        if (digitsWrap) {
          digitsWrap.innerHTML = `<span class="zerobloat-timer-expired-msg">${expiredText}</span>`;
        }
        return;
      }

      if (expiredAction === 'hide') {
        container.style.display = 'none';
      } else if (expiredAction === 'disable') {
        if (digitsWrap) {
          digitsWrap.innerHTML = `<span class="zerobloat-timer-expired-msg">${expiredText}</span>`;
        }
        if (addBtn) {
          addBtn.disabled = true;
          addBtn.classList.add('disabled');
          const btnText = addBtn.querySelector('.zerobloat-btn-text');
          if (btnText) btnText.textContent = expiredText;
        }
      } else if (expiredAction === 'restart') {
        if (timerType === 'evergreen') {
          targetTime = Date.now() + timerMinutes * 60 * 1000;
          try {
            localStorage.setItem(storageKey, targetTime.toString());
          } catch (e) {}
          tick();
        } else {
          container.style.display = 'none';
        }
      }
    }

    function tick() {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        onExpire();
        return false;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      if (days > 0) {
        if (daysBox) daysBox.style.display = 'inline-block';
        if (daysSep) daysSep.style.display = 'inline-block';
        if (dElem) dElem.textContent = pad(days);
      } else {
        if (daysBox) daysBox.style.display = 'none';
        if (daysSep) daysSep.style.display = 'none';
      }

      if (hElem) hElem.textContent = pad(hours);
      if (mElem) mElem.textContent = pad(mins);
      if (sElem) sElem.textContent = pad(secs);

      return true;
    }

    const isRunning = tick();
    if (isRunning) {
      const timerInterval = setInterval(() => {
        const stillActive = tick();
        if (!stillActive) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZeroBloatBundles);
  } else {
    initZeroBloatBundles();
  }

  // Shopify Theme Editor Live Update Listeners
  ['shopify:section:load', 'shopify:section:select', 'shopify:block:select', 'shopify:block:deselect'].forEach((evt) => {
    document.addEventListener(evt, () => {
      document.querySelectorAll('.zerobloat-bundle-container').forEach((c) => delete c.dataset.initialized);
      initZeroBloatBundles();
    });
  });
})();
