/**
 * ZeroBloat Kit Misto (Mix & Match / Cross-Sell) - Pure Vanilla JS (< 3.5KB)
 * Zero dependencies, instant client-side calculation, progressive tiered discounts & native Shopify Cart API.
 */

(function () {
  function initMixMatchBundles() {
    const containers = document.querySelectorAll('.zerobloat-mm-container');

    containers.forEach((container) => {
      if (container.dataset.initialized) return;
      container.dataset.initialized = 'true';

      const blockId = container.dataset.blockId;
      const discount2 = parseInt(container.dataset.discount2 || '15', 10);
      const discount3 = parseInt(container.dataset.discount3 || '20', 10);
      const discount4 = parseInt(container.dataset.discount4 || '25', 10);
      const discount5 = parseInt(container.dataset.discount5 || '30', 10);

      const currencySymbol = container.dataset.currencySymbol || '$';
      const checkboxes = container.querySelectorAll('.zerobloat-mm-checkbox');
      const variantSelects = container.querySelectorAll('.zerobloat-mm-item-variant');
      const addBtn = container.querySelector('.zerobloat-mm-btn');
      const totalElem = container.querySelector('.zerobloat-mm-total-price');
      const compareElem = container.querySelector('.zerobloat-mm-compare-price');
      const savingsElem = container.querySelector('.zerobloat-mm-savings-badge');
      const headerBadge = container.querySelector('.zerobloat-mm-header-badge');

      const isMainAvailable = container.dataset.mainAvailable !== 'false';
      const defaultBtnText = container.dataset.btnText || 'Add Bundle to Cart';
      const soldOutText = container.dataset.soldOutText || 'Sold Out';
      const loadingText = container.dataset.loadingText || 'Adding Bundle...';
      const addedText = container.dataset.addedText || 'Added to Cart!';
      const savePrefix = container.dataset.savePrefix || 'Save';

      // Initialize Urgency Countdown Timer (if enabled)
      setupCountdownTimer(container, addBtn);

      function formatMoney(cents) {
        return currencySymbol + (cents / 100).toFixed(2);
      }

      function getActiveDiscount(count) {
        if (count >= 5) return discount5;
        if (count === 4) return discount4;
        if (count === 3) return discount3;
        if (count >= 2) return discount2;
        return 0;
      }

      function updateCalculation() {
        let originalTotalCents = 0;
        let selectedCount = 0;
        let hasUnavailableSelected = false;

        checkboxes.forEach((cb) => {
          const itemEl = cb.closest('.zerobloat-mm-item');
          const thumbEl = container.querySelector(
            `.zerobloat-mm-thumb-card[data-product-id="${cb.dataset.productId}"]`
          );

          if (cb.checked) {
            selectedCount++;
            itemEl.classList.add('active');
            if (thumbEl) {
              thumbEl.classList.add('active');
              thumbEl.classList.remove('inactive');
            }

            if (cb.dataset.available === 'false') {
              hasUnavailableSelected = true;
            }

            const varSelect = itemEl.querySelector('.zerobloat-mm-item-variant');
            if (varSelect) {
              const chosenOpt = varSelect.selectedOptions[0];
              const priceCents = parseInt(chosenOpt?.dataset.price || cb.dataset.price, 10);
              originalTotalCents += priceCents;
              if (chosenOpt && chosenOpt.dataset.available === 'false') {
                hasUnavailableSelected = true;
              }
            } else {
              originalTotalCents += parseInt(cb.dataset.price, 10);
            }
          } else {
            itemEl.classList.remove('active');
            if (thumbEl) {
              thumbEl.classList.remove('active');
              thumbEl.classList.add('inactive');
            }
          }
        });

        // Determine dynamic progressive discount based on number of items checked
        const activeDiscount = getActiveDiscount(selectedCount);
        const qualifiesForDiscount = selectedCount >= 2 && activeDiscount > 0;

        const finalTotalCents = qualifiesForDiscount
          ? Math.round(originalTotalCents * (1 - activeDiscount / 100))
          : originalTotalCents;

        const savedCents = originalTotalCents - finalTotalCents;

        if (headerBadge) {
          headerBadge.textContent = `${activeDiscount || discount2}% OFF`;
        }

        if (totalElem) {
          totalElem.textContent = formatMoney(finalTotalCents);
        }

        if (compareElem) {
          if (qualifiesForDiscount && savedCents > 0) {
            compareElem.textContent = formatMoney(originalTotalCents);
            compareElem.style.display = 'inline';
          } else {
            compareElem.style.display = 'none';
          }
        }

        if (savingsElem) {
          if (qualifiesForDiscount && savedCents > 0) {
            savingsElem.textContent = `${savePrefix} ${activeDiscount}% (${formatMoney(savedCents)})`;
            savingsElem.style.display = 'inline-block';
          } else {
            savingsElem.style.display = 'none';
          }
        }

        if (addBtn) {
          const btnText = addBtn.querySelector('.zerobloat-mm-btn-text');

          if (!isMainAvailable || hasUnavailableSelected) {
            addBtn.disabled = true;
            addBtn.classList.add('disabled');
            if (btnText) btnText.textContent = soldOutText;
          } else if (selectedCount === 0) {
            addBtn.disabled = true;
            addBtn.classList.add('disabled');
            if (btnText) btnText.textContent = defaultBtnText;
          } else {
            addBtn.disabled = false;
            addBtn.classList.remove('disabled');
            if (btnText) {
              btnText.textContent = defaultBtnText + (selectedCount > 1 ? ` (${selectedCount})` : '');
            }
          }
        }
      }

      // Checkbox click listeners
      checkboxes.forEach((cb) => {
        cb.addEventListener('change', updateCalculation);
      });

      // Variant dropdown change listeners
      variantSelects.forEach((sel) => {
        sel.addEventListener('change', function () {
          const itemEl = this.closest('.zerobloat-mm-item');
          const priceDisplay = itemEl.querySelector('.zerobloat-mm-item-price');
          const chosenOpt = this.selectedOptions[0];
          if (chosenOpt && priceDisplay) {
            priceDisplay.textContent = formatMoney(parseInt(chosenOpt.dataset.price, 10));
          }

          // Dynamically swap thumbnail photo
          const chk = itemEl.querySelector('.zerobloat-mm-checkbox');
          if (chk && chosenOpt && chosenOpt.dataset.image) {
            const thumbEl = container.querySelector(
              `.zerobloat-mm-thumb-card[data-product-id="${chk.dataset.productId}"]`
            );
            if (thumbEl) {
              const img = thumbEl.querySelector('img');
              if (img && chosenOpt.dataset.image) {
                img.src = chosenOpt.dataset.image;
              }
            }
          }

          updateCalculation();
        });
      });

      // Add to cart click
      if (addBtn) {
        addBtn.addEventListener('click', async function (e) {
          e.preventDefault();

          if (addBtn.disabled) return;

          const activeDiscount = getActiveDiscount(
            Array.from(checkboxes).filter((c) => c.checked).length
          );

          const itemsToAdd = [];

          checkboxes.forEach((cb) => {
            if (cb.checked) {
              const itemEl = cb.closest('.zerobloat-mm-item');
              const varSelect = itemEl.querySelector('.zerobloat-mm-item-variant');
              const variantId = varSelect ? varSelect.value : cb.dataset.variantId;

              itemsToAdd.push({
                id: parseInt(variantId, 10),
                quantity: 1,
                properties: {
                  _bundle_type: 'Mix & Match Pro',
                  _bundle_discount: activeDiscount + '%',
                },
              });
            }
          });

          if (itemsToAdd.length === 0) return;

          addBtn.classList.add('loading');
          const btnText = addBtn.querySelector('.zerobloat-mm-btn-text');
          const originalText = btnText ? btnText.textContent : defaultBtnText;
          if (btnText) btnText.textContent = loadingText;

          try {
            const res = await fetch('/cart/add.js', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items: itemsToAdd }),
            });

            if (res.ok) {
              if (btnText) btnText.textContent = '✓ ' + addedText;
              document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true }));

              setTimeout(() => {
                window.location.href = '/checkout';
              }, 400);
            } else {
              throw new Error('Cart API returned error');
            }
          } catch (err) {
            console.error('[ZeroBloat MM] Error adding bundle to cart:', err);
            if (btnText) btnText.textContent = originalText;
            addBtn.classList.remove('loading');
            alert('Could not add bundle to cart. Please try again.');
          }
        });
      }

      // Initial run
      updateCalculation();
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

    const storageKey = 'zb_mm_timer_' + (container.id || 'mixmatch');

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
          const btnText = addBtn.querySelector('.zerobloat-mm-btn-text');
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
    document.addEventListener('DOMContentLoaded', initMixMatchBundles);
  } else {
    initMixMatchBundles();
  }

  // Shopify Theme Editor Live Update Listeners
  ['shopify:section:load', 'shopify:section:select', 'shopify:block:select', 'shopify:block:deselect'].forEach((evt) => {
    document.addEventListener(evt, () => {
      document.querySelectorAll('.zerobloat-mm-container').forEach((c) => delete c.dataset.initialized);
      initMixMatchBundles();
    });
  });
})();
