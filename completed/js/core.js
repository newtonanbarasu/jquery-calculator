var calculatorObject = {
	defaultValue : '0.00',
	operators : ['+', '-', '*', '/'],
	sequence : [ ],
	cycleCompleted : false,
	url : './mod/calculate.php',
    result: $('#calculatorResult'),
	isNumber : function(value) {

        "use strict";

		return (
            typeof value !== 'undefined' &&
			! isNaN(parseFloat(value)) &&
            isFinite(value)
        );

	},
	calculate : function() {

        "use strict";

        var self = this;

        $.ajax({
            type: "POST",
            dataType: 'json',
            url: self.url,
            data: { sequence : self.sequence },
            success: function(data) {

                self.result.html(data);
                self.cycleCompleted = true;
                self.sequence = [ ];

            },
            error: function(jqXHR, textStatus, errorThrown) {

                throw new Error(errorThrown);

            }
        });

	},
	init : function() {

        "use strict";

        var self = this;

        $(document).on('click', '#calculator ul li', function() {

            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');

            var clickedValue = $(this).data('value'),
                displayValue = self.result.text();

            switch(clickedValue) {

                case '=':
                    self.equal(displayValue);
                    break;

                case 'c':
                    self.clear();
                    break;

                case self.operators[0]:
                case self.operators[1]:
                case self.operators[2]:
                case self.operators[3]:
                    self.operator(clickedValue, displayValue);
                    break;

                default:
                    self.default(clickedValue, displayValue);
                    break;

            }

        });
	},
    equal: function(displayValue) {

        "use strict";

        this.sequence.push(displayValue);
        this.calculate();

    },
    clear: function() {

        "use strict";

        this.sequence = [ ];
        this.result.html(this.defaultValue);

    },
    operator: function(clickedValue, displayValue) {

        "use strict";

        if (this.cycleCompleted) {

            this.cycleCompleted = false;

        }

        this.sequence.push(displayValue);

        if (this.isNumber(displayValue)) {

            this.sequence.push(clickedValue);

        } else {

            this.sequence[this.sequence.length-1] = clickedValue;

        }

        this.result.html(clickedValue);

    },
    default: function(clickedValue, displayValue) {

        "use strict";

        if ($.inArray(displayValue, this.operators) !== -1) {

            this.result.html(clickedValue);

        } else {

            if (displayValue === this.defaultValue) {

                this.result.html(clickedValue);

            } else {

                if (this.cycleCompleted) {

                    this.cycleCompleted = false;
                    this.result.html(clickedValue);

                } else {

                    this.result.html(displayValue + clickedValue);

                }

            }

        }

    }
};
$(function() {

    "use strict";

	calculatorObject.init();

});