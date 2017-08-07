;(function ($) {
    "use strict";

    if (window.LP === undefined) {
        window.LP = {};
    }

    /**
     * Checkout
     *
     * @type {LP.Checkout}
     */
    var Checkout = LP.Checkout = function (options) {
        var
            /**
             * Checkout form
             *
             * @type {form}
             */
            $formCheckout = $('#learn-press-checkout'),

            /**
             * Register form
             *
             * @type {form}
             */
            $formLogin = $('#learn-press-checkout-register'),

            /**
             * Login form
             *
             * @type {form}
             */
            $formRegister = $('#learn-press-checkout-login'),

            /**
             * Payment method wrap
             *
             * @type {*}
             */
            $payments = $('.payment-methods'),

            /**
             * Button checkout
             *
             * @type {*}
             */
            $buttonCheckout = $('#learn-press-checkout-place-order'),

            /**
             * The payment method has selected.
             *
             * @type {string}
             */
            selectedMethod = ''
        ;

        var _formSubmit = function (e) {
            e.preventDefault();
            var $form = $payments.children('.selected'),
                data = $form.serializeJSON()

            if ($form.triggerHandler('learn_press_checkout_place_order') !== false && $form.triggerHandler('learn_press_checkout_place_order_' + selectedMethod) !== false) {

                removeMessage();

                if (options.i18n_processing) {
                    $buttonCheckout.html(options.i18n_processing);
                }
                $buttonCheckout.prop('disabled', true);

                //LP.blockContent();
                $.ajax({
                    url: options.ajaxurl + '/?lp-ajax=checkout',
                    dataType: 'html',
                    data: data,
                    type: 'post',
                    success: function (response) {
                        response = LP.parseJSON(response);
                        if (response.result === 'fail') {
                            if (!response.messages) {
                                if (response.code && response.code == 30) {
                                    showMessage('<div class="learn-press-error">' + options.i18n_invalid_field + '</div>');
                                } else {
                                    showMessage('<div class="learn-press-error">' + options.i18n_unknown_error + '</div>');
                                }
                            } else {
                                showMessage(response.messages);
                            }

                        } else if (response.result === 'success') {
                            if (response.redirect) {
                                $buttonCheckout.val(options.i18n_redirecting);
                                //LP.reload(response.redirect);
                                return;
                            }
                        }
                        $buttonCheckout.html(options.i18n_place_order);
                        $buttonCheckout.prop('disabled', false);
                        console.log(123)
                        LP.unblockContent();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showMessage('<div class="learn-press-error">' + errorThrown + '</div>');
                        $buttonCheckout.html(options.i18n_place_order);
                        $buttonCheckout.prop('disabled', false);
                        LP.unblockContent();
                    }
                });
            }
            return false;
        }

        /**
         * Show payment form on select
         */
        var _selectPaymentChange = function () {
            var id = $(this).val(),
                $selected = $payments.children().filter('.selected').removeClass('selected'),
                buttonText = $selected.find('#payment_method_' + selectedMethod).data('order_button_text');

            $selected.find('.payment-method-form').slideUp();
            $selected.end().filter('#learn-press-payment-method-' + id).addClass('selected').find('.payment-method-form').hide().slideDown();

            selectedMethod = $selected.find('payment_method').val();

            if (buttonText) {
                $buttonCheckout.html(buttonText);
            }
        }

        /**
         * Button to switch between mode login/register or place order
         * in case user is not logged in and guest checkout is enabled.
         */
        var _guestCheckoutClick = function () {
            var showOrHide = $formCheckout.toggle().is(':visible');
            $formLogin.toggle(!showOrHide);
            $formRegister.toggle(!showOrHide);
            $('#learn-press-button-guest-checkout').toggle(!showOrHide);
        }

        var showMessage = function (messages) {
            removeMessage();
            $formCheckout.prepend(messages);
            $('html, body').animate({
                scrollTop: ( $formCheckout.offset().top - 100 )
            }, 1000);
            $(document).trigger('learn-press/checkout-error');
        }

        var removeMessage = function(){
            $('.learn-press-error, .learn-press-notice, .learn-press-message').remove();
        }

        /**
         * Place order action
         */
        $buttonCheckout.on('click', function (e) {




        });

        $('.lp-button-guest-checkout').on('click', _guestCheckoutClick);
        $payments.on('change select', 'input[name="payment_method"]', _selectPaymentChange);
        $formCheckout.on('submit', _formSubmit);

        $payments.children('.selected').find('input[name="payment_method"]').trigger('select');

        console.log(lpCheckoutSettings, options)
    }

    $(document).ready(function () {
        LP.$checkout = new Checkout(lpCheckoutSettings);
    })

})(jQuery);
//
// ;
// (function ($) {
// 	"use strict";
// 	LP.reload = function (url) {
// 		if (!url) {
// 			url = window.location.href;
// 		}
// 		window.location.href = url;
// 	};
// 	LP.Checkout = {
// 		$form              : null,
// 		init               : function () {
// 			var $doc = $(document);
// 			this.$form = $('form[name="lp-checkout"]');
// 			$doc.on('click', 'input[name="payment_method"]', this.selectPaymentMethod);
// 			$doc.on('click', '#learn-press-checkout-login-button', this.login);
//
// 			$('input[name="payment_method"]:checked').trigger('click');
// 			this.$form.on('submit', this.doCheckout);
// 		},
// 		selectPaymentMethod: function () {
// 			var methodId = $(this).attr('id'),
// 				checkoutButton = $('#learn-press-checkout-place-order'),
// 				isError = false;
// 			if ($('.payment-methods input.input-radio').length > 1) {
// 				var $paymentForm = $('div.payment-method-form.' + methodId);
//
// 				if ($(this).is(':checked')) {
// 					$('div.payment-method-form').filter(':visible').slideUp(250);
// 					$(this).parents('li:first').find('.payment-method-form.' + methodId).slideDown(250);
// 				}
// 			} else {
// 				$('div.payment-method-form').show();
// 			}
// 			isError = $('div.payment-method-form:visible').find('input[name="' + methodId + '-error"]').val() == 'yes';
// 			if (isError) {
// 				checkoutButton.attr('disabled', 'disabled');
// 			} else {
// 				checkoutButton.removeAttr('disabled');
// 			}
// 			var order_button_text = $(this).data('order_button_text');
// 			if (order_button_text) {
// 				checkoutButton.val(order_button_text);
// 			} else {
// 				checkoutButton.val(checkoutButton.data('value'));
// 			}
// 		},
// 		login              : function () {
// 			var $form = $(this.form);
// 			if ($form.triggerHandler('checkout_login') !== false) {
// 				$.ajax({
// 					url     : LP_Settings.siteurl + '/?lp-ajax=checkout-login',
// 					dataType: 'html',
// 					data    : $form.serialize(),
// 					type    : 'post',
// 					success : function (response) {
// 						response = LP.parseJSON(response);
// 						if (response.result === 'fail') {
// 							if (response.messages) {
// 								LP.Checkout.showErrors(response.messages);
// 							} else {
// 								LP.Checkout.showErrors('<div class="learn-press-error">Unknown error!</div>');
// 							}
// 						} else {
// 							if (response.redirect) {
// 								window.location.href = response.redirect;
// 							}
// 						}
// 					}
// 				});
// 			}
// 			return false;
// 		},
// 		doCheckout         : function () {
// 			var $form = $(this),
// 				$place_order = $form.find('#learn-press-checkout-place-order'),
// 				processing_text = $place_order.attr('data-processing-text'),
// 				text = $place_order.attr('value');
// 			if ($form.triggerHandler('learn_press_checkout_place_order') !== false && $form.triggerHandler('learn_press_checkout_place_order_' + $('#order_review').find('input[name=payment_method]:checked').val()) !== false) {
// 				if (processing_text) {
// 					$place_order.val(processing_text);
// 				}
// 				$place_order.prop('disabled', true);
// 				LP.blockContent();
// 				$.ajax({
// 					url     : LP_Settings.siteurl + '/?lp-ajax=checkout',
// 					dataType: 'html',
// 					data    : $form.serialize(),
// 					type    : 'post',
// 					success : function (response) {
// 						response = LP.parseJSON(response);
// 						if (response.result === 'fail') {
// 							var $error = '';
// 							if (!response.messages) {
// 								if (response.code && response.code == 30) {
// 									LP.Checkout.showErrors('<div class="learn-press-error">' + learn_press_js_localize.invalid_field + '</div>');
// 								} else {
// 									LP.Checkout.showErrors('<div class="learn-press-error">' + learn_press_js_localize.unknown_error + '</div>');
// 								}
// 							} else {
// 								LP.Checkout.showErrors(response.messages);
// 							}
//
// 						} else if (response.result === 'success') {
// 							if (response.redirect) {
// 								$place_order.val('Redirecting');
// 								LP.reload(response.redirect);
// 								return;
// 							}
// 						}
// 						$place_order.val(text);
// 						$place_order.prop('disabled', false);
// 						LP.unblockContent();
// 					},
// 					error   : function (jqXHR, textStatus, errorThrown) {
// 						LP.Checkout.showErrors('<div class="learn-press-error">' + errorThrown + '</div>');
// 						$place_order.val(text);
// 						$place_order.prop('disabled', false);
// 						LP.unblockContent();
// 					}
// 				});
// 			}
// 			return false;
// 		},
// 		showErrors         : function (messages) {
// 			$('.learn-press-error, .learn-press-notice, .learn-press-message').remove();
// 			this.$form.prepend(messages);
// 			$('html, body').animate({
// 				scrollTop: ( LP.Checkout.$form.offset().top - 100 )
// 			}, 1000);
// 			$(document).trigger('learnpress_checkout_error');
// 		}
// 	};
// 	$(document).ready(function () {
// 		LP.Checkout.init();
// 	});
// })(jQuery);