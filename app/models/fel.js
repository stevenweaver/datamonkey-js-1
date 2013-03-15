/*

  Datamonkey - An API for comparative analysis of sequence alignments using state-of-the-art statistical models.

  Copyright (C) 2013
  Sergei L Kosakovsky Pond (spond@ucsd.edu)
  Steven Weaver (sweaver@ucsd.edu)

  Permission is hereby granted, free of charge, to any person obtaining a
  copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be included
  in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


//Also needs to include status, and results
var mongoose = require('mongoose');

var Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;

//TODO: status needs to be a subdocument
var Fel = new Schema({
  msafn      : { type: Schema.Types.ObjectId, ref: 'Msa' },
  status     : String,
  sendmail   : Boolean,
  parameters : [FelParameters],
  results    : [FelResults],
  summary    : [FelSummary]
});

var FelParameters = new Schema({
  modelstring : String,
  treemode    : Number,
  pvalue      : Number,
});

var FelResults = new Schema({
  _creator   : { type: Schema.Types.ObjectId, ref: 'FEL' },
  codon      : Number,
  ds         : Number,
  dn         : Number,
  neutral_ds : Number,
  logl       : Number,
  lrt        : Number,
  p          : Number,
  scaleddnds : Number
});

var FelSummary = new Schema({
  _creator  : { type: Schema.Types.ObjectId, ref: 'FEL' },
  col_key   : String,
  col_value : String
});

module.exports = mongoose.model('Fel', Fel);
module.exports = mongoose.model('FelParameters', FelParameters);
module.exports = mongoose.model('FelResults', FelResults);
module.exports = mongoose.model('FelSummary', FelSummary);

