var Survey = ItemBase.extend({
	templateName: "survey-template",
	constructor: function(title) {
		this.base(title);
		this.questions = ko.observableArray();
		this.createTextBoxQuestion = this.createTextBoxQuestion.bind(this);
		this.createCheckBoxQuestion = this.createCheckBoxQuestion.bind(this);
		this.createRadioButtonQuestion = this.createRadioButtonQuestion.bind(this);
		this.createSelectListQuestion = this.createSelectListQuestion.bind(this);
		this.matchesTextFilter = this.matchesTextFilter.bind(this);

		this.isInEditMode = ko.observable(true);
	},
	toJSON: function() {
        var cleaned = this.base();

        delete cleaned.isInEditMode;
        return cleaned;
    },
    fromJSON: function(json) {
        this.base(json);
        
        // clear out questions
        this.questions([]);

        _.each(json.questions, function(jsonQuestion) {
            var question;
            switch(jsonQuestion.type) {
            	case 'textbox':
            		question = new Survey.TextBoxQuestion();
            		break;
            	case 'checkbox':
            		question = new Survey.CheckBoxQuestion();
            		break;
            	case 'radiobutton':
            		question = new Survey.RadioButtonQuestion();
            		break;
            	case 'selectlist':
            		question = new Survey.SelectListQuestion();
            		break;
            	default:
            		throw new Error('Unknown question type: ' + jsonQuestion.type);
            }
            question.fromJSON(jsonQuestion);
            this.questions.push(question);

        }, this);
    },
	createTextBoxQuestion: function() {
		this.questions.push(new Survey.TextBoxQuestion('[New Text Question]'));
	},
	createCheckBoxQuestion: function() {
		this.questions.push(new Survey.CheckBoxQuestion('[New Checkbox Question]'));
	},
	createRadioButtonQuestion: function() {
		this.questions.push(new Survey.RadioButtonQuestion('[New RadioButton Question]'));
	},
	createSelectListQuestion: function() {
		this.questions.push(new Survey.SelectListQuestion('[New SelectList Question]'));
	},
	matchesTextFilter: function(textFilter) {
		var title = this.title() || '';
		var titleMatches = title.toLowerCase().indexOf(textFilter.toLowerCase()) != -1;

		var anyQuestionsMatch = _.any(this.questions(), function(question) {
			return this._questionMatchesTextFilter(question, textFilter);
		}, this);

		return titleMatches || anyQuestionsMatch;
	},
	_questionMatchesTextFilter: function(question, textFilter) {
		var questionText = question.questionText() || '';
		var questionTextMatches = questionText.toLowerCase().indexOf(textFilter.toLowerCase()) != -1;

		var optionsMatch = false;
		if (question.options !== undefined) {
			optionsMatch = _.any(question.options(), function (option) {
				var optionText = option.optionText() || '';
				return optionText.toLowerCase().indexOf(textFilter.toLowerCase()) != -1;
			});
		}

		return questionTextMatches || optionsMatch;
	}
});

Survey.QuestionBase = Base.extend({
	constructor: function (questionText) {
		this.questionText = ko.observable(questionText);
	},
	toJSON: function() {
		var cleaned = ko.toJS(this);
		cleaned.type = cleaned.templateName.replace('-template', '').replace('survey-', '');
		delete cleaned.templateName;

		return cleaned;
	},
	fromJSON: function(json) {
		this.questionText(json.questionText);
	}
});

Survey.TextBoxQuestion = Survey.QuestionBase.extend({
	templateName: "survey-textbox-template",
});

// Inheritance
Survey.MultipleChoiceQuestionBase = Survey.QuestionBase.extend({
	templateName: "survey-checkbox-template",
	constructor: function (questionText) {
		this.base(questionText);
		this.options = ko.observableArray();

		this.addOption = this.addOption.bind(this);
	},
	addOption: function() {
		this.options.push(new Survey.MultipleChoiceOption());
	},
	fromJSON: function(json) {
		this.base(json);
		_.each(json.options, function(jsonOption) {
			var option = new Survey.MultipleChoiceOption();
			option.optionText(jsonOption.optionText);
			this.options.push(option);
		}, this);
	}
});
Survey.MultipleChoiceOption = Base.extend({
	constructor: function (optionText) {
		this.optionText = ko.observable(optionText);
	}
});
Survey.CheckBoxQuestion = Survey.MultipleChoiceQuestionBase.extend({
	templateName: "survey-checkbox-template"
});
Survey.RadioButtonQuestion = Survey.MultipleChoiceQuestionBase.extend({
	templateName: "survey-radiobutton-template",
	// Below: for preview 
	constructor: function(questionText) {
		this.base(questionText);
		this.dummyRadioSelection = ko.observable();
	}
});
Survey.SelectListQuestion = Survey.MultipleChoiceQuestionBase.extend({
	templateName: "survey-selectlist-template"
});







