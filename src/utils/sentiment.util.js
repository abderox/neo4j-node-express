// const aposToLexForm = require('apos-to-lex-form');
import aposToLexForm from "apos-to-lex-form";
import natural from 'natural';
import SpellCorrector from 'spelling-corrector';
import SW from 'stopword';
import Filter from 'bad-words';


const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

export const filter_bad_words = (review) => {

    const filter = new Filter();
    return filter.clean(review);
};


//  nlp 
export const nlp_sentiment_analysis = (review) => {



    const lexedReview = aposToLexForm(review);

    // casing
    const casedReview = lexedReview.toLowerCase();

    // removing
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

    // tokenize review
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

    // spell correction
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })

    // remove stopwords
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

    const analysis = analyzer.getSentiment(filteredReview);
    console.log("🚀 ~ file: sentiment.util.js:49 ~ analysis", analysis)

        
    return analysis;

}
