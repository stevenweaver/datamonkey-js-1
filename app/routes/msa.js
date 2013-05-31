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


var dpl = require('../../lib/datamonkey-pl.js');

var mongoose = require('mongoose')
  , Msa = mongoose.model('Msa');

//find sequence by id
exports.findById = function(req, res) {

  var id = req.params.id;

  console.log('Retrieving sequence: ' + id);

  Msa.findOne({msaid : id}, function(err, items) {
    if (err)
      res.send('There is no sequence with id of ' + id);
    else
      res.send(items);
  });

};

//return all sequences
exports.findAll = function(req, res) {

 Msa.find({},function(err, items) {
   if (err)
     res.send('There is no sequence with id of ' + id);
    else
     res.send(items);
   });

};

//upload a sequence
exports.uploadMsa = function(req, res) {

  postdata = req.query;
  postdata.contents = req.body["file"][1];

  //TODO: Clean postdata
  var sequence_alignment = new Msa({
    contents    : postdata.contents,  
    datatype    : postdata.datatype,
    gencodeid   : postdata.genCodeId,
    mailaddr    : postdata.mailaddr,
  });

  sequence_alignment.save(function (err,result) {

    if (err) {
      res.send({'error':err});
    } 

    else {
      //Upload to datamonkey
      dpl.uploadToPerl(result,res);
    }

  });

}

//update a sequence
exports.updateMsa = function(req, res) {

  var id = req.params.id;
  var postdata = req.body;

  console.log('Updating sequence: ' + id);
  console.log(JSON.stringify(sequence));

  //Should check the postdata before
  Msa.update(postdata, function (err, result) {
    if (err) {
      res.send({'error':'An error has occurred'});
    } 
    else {
      //TODO: Only should log when debugging
      //console.log('Success: ' + JSON.stringify(result));
      res.send(postdata);
    }
  });
}

//delete a sequence
exports.deleteMsa = function(req, res) {

  var id = req.params.id;
  console.log('Deleting sequence: ' + id);

  Msa.remove({ msaid: new BSON.ObjectID(id) }, function(err) {
    if (err) {
      res.send({'error':'An error has occurred - ' + err});
    }

    else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
     }

  });
  
}
