import {  LightningElement, track, wire  } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import submitResponseData from '@salesforce/apex/designSurvey.submitResponseData';
import getProject from '@salesforce/apex/ProjectSurveyController.getProject';
//import { getRecord } from 'lightning/uiRecordApi';
import SurveyFormLogo from '@salesforce/resourceUrl/designSurveyFormLogo';
import ThankYouImage from '@salesforce/resourceUrl/ThankyouImage';

export default class DesignSurvey extends LightningElement {

        @track relatedRecordId;
        // @track relatedRecordName; // Track the record name
        @track showSurvey = true;
        @track showImage = true; // Set to false if you want to hide the image
        @track showSpinner = false; // Initialize spinner to false
        imageUrl = SurveyFormLogo;
        @track displayImage = false;
        displayUrl = ThankYouImage;
        @track surveyHeading = 'Design Survey';
        @track surveyDescription = '';
        @track surveyQuestions = [
            {
                id: 'Q1',
                text: 'How satisfied are you with the final concept and visual of your Custom Design Project?',
                options: [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }, { label: '5', value: '5' }],
                selectedOption: ''
            },
    
            {
                id: 'Q2',
                text: 'How satisfied are you with the communication from the R+ Director of Design?',
                options: [{ label: '1', value: '6' }, { label: '2', value: '7' }, { label: '3', value: '8' }, { label: '4', value: '9' }, { label: '5', value: '10' }],
                selectedOption: ''
            },
    
            {
                id: 'Q3',
                text: 'How satisfied are you with the integration of your input throughout the Custom Design Process?',
                options: [{ label: '1', value: '11' }, { label: '2', value: '12' }, { label: '3', value: '13' }, { label: '4', value: '14' }, { label: '5', value: '15' }],
                selectedOption: ''
            }
        ];
    
        @track surveyQuestions2 = [
            {
                id: 'Q4',
                text: 'How satisfied are you with the way the R+ Director of Design collaborated with other vendors involved in this area of your project?',
                options: [{ label: '1', value: '16' }, { label: '2', value: '17' }, { label: '3', value: '18' }, { label: '4', value: '19' }, { label: '5', value: '20' }, { label: 'N/A', value: '40' }],
                selectedOption: ''
            },
    
            {
                id: 'Q5',
                text: 'How satisfied are you that your business’s Redemption needs will be met with your Custom Design?',
                options: [{ label: '1', value: '21' }, { label: '2', value: '22' }, { label: '3', value: '23' }, { label: '4', value: '24' }, { label: '5', value: '25' }],
                selectedOption: ''
            },
    
            {
                id: 'Q6',
                text: 'How satisfied are you with how your Custom Design is likely to influence the experience of your guests?',
                options: [{ label: '1', value: '26' }, { label: '2', value: '27' }, { label: '3', value: '28' }, { label: '4', value: '29' }, { label: '5', value: '30' }],
                selectedOption: ''
            }
        ];
    
        @wire(CurrentPageReference)
        getStateParameters(currentPageReference) {
            console.log('currentPageReference => ', JSON.stringify(currentPageReference));
            if (currentPageReference) {
                this.relatedRecordId = currentPageReference.state?.id;
                console.log('this.relatedRecordId => ' + this.relatedRecordId);
            }
        }
    
        // connectedCallback() {
        //     if (this.relatedRecordId) {
        //         this.fetchProjectName();
        //     }
        // }
    
        // fetchProjectName() {
        //     getProject({ recordId: this.relatedRecordId })
        //         .then(result => {
        //             this.relatedRecordName = result.Name;
        //             console.log('Record Name:', this.relatedRecordName);
        //         })
        //         .catch(error => {
        //             console.error('Error fetching record name:', error);
        //         });
        // }
    
        handleOptionChange(event) {
            const questionId = event.target.name;
            const selectedOption = event.target.value;
            console.log('Value ->', selectedOption);
            this.updateSelectedOption(this.surveyQuestions, questionId, selectedOption);
            this.updateSelectedOption(this.surveyQuestions2, questionId, selectedOption);
        }
    
        updateSelectedOption(questionSet, questionId, selectedOption) {
            console.log('Value Selected ->', selectedOption);
            questionSet.forEach(question => {
                if (question.id === questionId) {
                    question.selectedOption = selectedOption;
                }
            });
        }
    
        handleDescriptionChange(event) {
            this.surveyDescription = event.target.value;
        }
    
        handleSubmit() {
            this.showSpinner = true;
            const SurveyData = {
                finalConcept: this.surveyQuestions[0].selectedOption,
                communication: this.surveyQuestions[1].selectedOption,
                integration: this.surveyQuestions[2].selectedOption,
                collaboration: this.surveyQuestions2[0].selectedOption,
                businessNeeds: this.surveyQuestions2[1].selectedOption,
                influence: this.surveyQuestions2[2].selectedOption,
                description: this.surveyDescription
            };
    
            submitResponseData({ SurveyData, relatedRecordId: this.relatedRecordId })
                .then(result => {
                    console.log('Survey data submitted successfully:', result);
                    this.showSurvey = false;
                })
                .catch(error => {
                    console.error('Error submitting survey data:', error);
                    // console.log('Survey data => ', JSON.stringify(SurveyData));
                    // console.log('Record id => ',this.relatedRecordId);
                    // console.log('state => ', this.currentPageReference);
                    
                console.log('this.relatedRecordId => ' + this.relatedRecordId);
                })
                .finally(() => {
                    this.showSpinner = false;
                    this.displayImage = true;
                });
        }
}
