var querystring = require("querystring"),
  error = require(__dirname + " /../../lib/error.js"),
  globals = require(__dirname + "/../../config/globals.js"),
  mailer = require(__dirname + "/../../lib/mailer.js"),
  helpers = require(__dirname + "/../../lib/helpers.js"),
  hpcsocket = require(__dirname + "/../../lib/hpcsocket.js"),
  fs = require("fs"),
  path = require("path"),
  logger = require("../../lib/logger");

var mongoose = require("mongoose"),
  Msa = mongoose.model("Msa"),
  Sequences = mongoose.model("Sequences"),
  PartitionInfo = mongoose.model("PartitionInfo"),
  Flea = mongoose.model("Flea");

exports.form = function(req, res) {
  res.render("flea/form.ejs");
};

exports.invoke = function(req, res) {
  var postdata = req.body;
  var msas = [];
  var flea_files = postdata.flea_files;
  var flea_tmp_dir = path.join(__dirname, "/../../uploads/flea/tmp/");
  var flea_files = JSON.parse(flea_files);
  var datatype = 0;
  var gencodeid = 1;

  var populateFilename = function(obj) {
    return {
      fn: flea_tmp_dir + obj.fn,
      last_modified: obj.last_modified,
      visit_code: obj.visit_code,
      visit_date: obj.visit_date
    };
  };

  flea_files = flea_files.map(populateFilename);

  if (postdata.receive_mail == "true") {
    flea.mail = postdata.mail;
  }

  // Loop through each file upload
  flea_files.forEach(function(flea_file) {
    Msa.parseFile(flea_file.fn, datatype, gencodeid, function(err, msa) {
      if (err) {
        // remove all files from tmp directory and start over
        res.render("flea/form.ejs");
      } else {
        msa.visit_code = flea_file.visit_code;
        msa.visit_date = flea_file.visit_date;
        msa.original_filename = path.basename(flea_file.fn);
        msas.push(msa);
      }

      if (msas.length == flea_files.length) {
        var flea = new Flea();
        flea.msas = msas;

        flea.save(function(err, flea_result) {
          if (err) {
            logger.error("flea save failed");
            res.json(500, { error: err });
            return;
          }

          function respond_with_json(err, result) {
            if (err) {
              logger.error("flea rename failed");
              res.json(500, { error: err });
            } else {
              // Send the MSA and analysis type
              var connect_callback = function(err, result) {
                logger.log(result);
              };

              var stream = Flea.pack(flea);

              stream.on("close", function() {
                res.json(200, { flea: flea });
              });

              Flea.submitJob(flea_result, connect_callback);
            }
          }

          // wait until all files have been moved before sending json response
          var count = 1;
          var was_error = false;

          var move_cb = function(err, result) {
            count = count + 1;
            if (err) {
              was_error = true;
            } else {
              if (count == flea_files.length) {
                if (err) {
                  respond_with_json("failure", "");
                } else {
                  respond_with_json("", true);
                }
              }
            }
          };

          msas.forEach(function(flea_file) {
            var current_location = flea_tmp_dir + flea_file.original_filename;
            var final_dest = flea_result.filedir + flea_file._id + ".fastq";
            helpers.moveSafely(current_location, final_dest, move_cb);
          });
        });
      }
    });
  });
};

/**
 * Displays id page for analysis
 * app.get('/flea/:id', flea.getFlea);
 */
exports.getPage = function(req, res) {
  // Find the analysis
  // Return its results
  var fleaid = req.params.id;

  //Return all results
  Flea.findOne({ _id: fleaid }, function(err, flea) {
    if (err || !flea) {
      res.json(500, error.errorResponse("Invalid ID : " + fleaid));
    } else {
      if (flea.status != "completed") {
        flea.filesize(function(err, bytes) {
          res.render("flea/jobpage.ejs", {
            job: flea,
            size: bytes
          });
        });
      } else {
        var html_dir = "./public/assets/lib/";
        res.sendfile(path.resolve(html_dir, "flea/dist/index.html"));
      }
    }
  });
};

/**
 * Displays id page for analysis
 * app.get('/flea/:id', flea.getFlea);
 */
exports.restart = function(req, res) {
  // Find the analysis
  // Return its results
  var fleaid = req.params.id;

  var connect_callback = function(err, result) {
    logger.log(result);
  };

  //Return all results
  Flea.findOne({ _id: fleaid }, function(err, flea) {
    if (err || !flea) {
      res.json(500, error.errorResponse("Invalid ID : " + fleaid));
    } else {
      flea.status = "running";
      flea.save(function(err, flea_result) {
        res.redirect("/flea/" + fleaid);
        var jobproxy = new hpcsocket.HPCSocket(
          {
            filepath: flea_result.filepath,
            msas: flea_result.msas,
            analysis: flea_result,
            status_stack: flea_result.status_stack,
            type: "flea"
          },
          connect_callback
        );
      });
    }
  });
};

getResultsHelper = function(req, res, key) {
  var fleaid = req.params.id;
  Flea.findOne({ _id: fleaid }, function(err, flea) {
    if (err || !flea) {
      res.json(500, error.errorResponse("Invalid id : " + fleaid));
    } else {
      if (key) {
        res.json(200, JSON.parse(flea.results[key]));
      } else {
        res.json(200, JSON.parse(flea.results));
      }
    }
  });
};

exports.getResults = function(req, res) {
  getResultsHelper(req, res, "");
};

exports.getRates = function(req, res) {
  getResultsHelper(req, res, "rates");
};

exports.getFrequencies = function(req, res) {
  getResultsHelper(req, res, "frequencies");
};

exports.getSequences = function(req, res) {
  getResultsHelper(req, res, "sequences");
};

exports.getRatesPheno = function(req, res) {
  getResultsHelper(req, res, "rates_pheno");
};

exports.getGenes = function(req, res) {
  getResultsHelper(req, res, "");
};

exports.getTrees = function(req, res) {
  getResultsHelper(req, res, "trees");
};

exports.getDivergence = function(req, res) {
  getResultsHelper(req, res, "divergence");
};

exports.getCopyNumbers = function(req, res) {
  getResultsHelper(req, res, "copynumbers");
};

exports.getRunInfo = function(req, res) {
  getResultsHelper(req, res, "run_info");
};

exports.getDates = function(req, res) {
  getResultsHelper(req, res, "dates");
};

exports.getCoordinates = function(req, res) {
  getResultsHelper(req, res, "coordinates");
};
