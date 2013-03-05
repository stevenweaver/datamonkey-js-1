var mongoose = require('mongoose');

var Schema = mongoose.Schema
    ,ObjectId = Schema.ObjectId;


//TODO: status needs to be a subdocument
//TODO: Include SLAC

var Uds = new Schema({
  msafn               : { type : Schema.Types.ObjectId, ref : 'MSA' },
  status              : String,
  sendmail            : Boolean,
  aa_alignment        : [AaAlignment]
  accessory_mutations : [AccessoryMutations]
  accessory_test      : [AccessoryTest]
  base_frequencies    : [BaseFrequencies]
  diversity_sw        : [DiversitySw]
  diversity_sws       : [DiversitySws]
  dnds                : [Dnds]
  legend              : [Legend]
  mdr_summary         : [MdrSummary]
  mdr_variants        : [MdrVariants]
  mu_rate_classes     : [MuRateClasses]
  nuc_alignment       : [NucAlignment]
  sequences           : [Sequences]
  settings            : [Settings]
  site_dr_posteriors  : [SiteDrPosteriors]
  site_mu_rates       : [SiteMuRates]
  site_posteriors     : [SitePosteriors]
  uds_file_info       : [UdsFileInfo]
  uds_qc_stats        : [UdsQcStats]
});

var UdsParameters = new Schema({
  modelstring : String,
  treemode    : Number,
  pvalue      : Number,
});

var AaAlignment = new Schema({
  _creator       : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  aaa            : Number,
  aac            : Number,
  aag            : Number,
  aat            : Number,
  aca            : Number,
  acc            : Number,
  acg            : Number,
  act            : Number,
  aga            : Number,
  agc            : Number,
  agg            : Number,
  agt            : Number,
  ata            : Number,
  atc            : Number,
  atg            : Number,
  att            : Number,
  caa            : Number,
  cac            : Number,
  cag            : Number,
  cat            : Number,
  cca            : Number,
  ccc            : Number,
  ccg            : Number,
  cct            : Number,
  cga            : Number,
  cgc            : Number,
  cgg            : Number,
  cgt            : Number,
  consensus      : String,
  consensus_aa   : String,
  coverage       : Number,
  cta            : Number,
  ctc            : Number,
  ctg            : Number,
  ctt            : Number,
  gaa            : Number,
  gac            : Number,
  gag            : Number,
  gat            : Number,
  gca            : Number,
  gcc            : Number,
  gcg            : Number,
  gct            : Number,
  gga            : Number,
  ggc            : Number,
  ggg            : Number,
  ggt            : Number,
  gta            : Number,
  gtc            : Number,
  gtg            : Number,
  gtt            : Number,
  indel_position : Number,
  position       : Number,
  reference      : String,
  reference_aa   : String,
  tac            : Number,
  tat            : Number,
  tca            : Number,
  tcc            : Number,
  tcg            : Number,
  tct            : Number,
  tgc            : Number,
  tgg            : Number,
  tgt            : Number,
  tta            : Number,
  ttc            : Number,
  ttg            : Number,
  ttt            : Number
});

var AccessoryMutations = new Schema({
  _creator        : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  read_id         : String,
  primary_site    : Number,
  primary_wt      : String,
  primary_rt      : String,
  primary_obs     : String,
  secondary_site  : Number,
  secondary_wt    : String,
  secondary_rt    : String,
  secondary_obs   : String,
  hxb2_aa         : String,
  read_aa         : String,
  per_base_sc     : Number,
  exp_per_base_sc : Number
});

var AccessoryTest = new Schema({
  _creator     : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  dr_acc       : String,
  notdr_acc    : Number,
  dr_notacc    : String,
  notdr_notacc : String,
  p_val        : Number
});

var BaseFrequencies = new Schema({
  _creator    : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  matrix      : String
});

var DiversitySw = new Schema({
  _creator              : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  width                 : Number,
  stride                : Number,
  min_coverage          : Number,
  div_threshold         : Number,
  num_windows           : Number,
  max_divergence        : Number,
  max_divergence_window : Mixed,
  dual_infection        : Mixed
});

var DiversitySws = new Schema({
  _creator       : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  start          : Number,
  end            : Number,
  coverage       : Number,
  freq_cutoff    : Number,
  variants       : Number,
  div_ml         : Number,
  div_med        : Number,
  div_25         : Number,
  div_975        : Number,
  dual_infection : Number,
  nuc_align      : Number
});

var Dnds = new Schema({
  _creator    : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  pos          : Number,
  cons_aa      : String,
  s_sites      : Number,
  ns_sites     : Number,
  s_subs       : Number,
  ns_subs      : Number,
  pp_number    : Number,
  pn_number    : Number
});

var Legend = new Schema({
  _creator    : { type : Schema.Types.ObjectId, ref : 'Uds' },
  table_name  : String,
  field_name  : String,
  description : String
});

var MdrSummary = new Schema({
  _creator       : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  ref_gene       : String,
  drug_class     : String,
  median_mut_rnk : Number,
  p_value        : Number,
  dr_score       : Number,
  dr_coverage    : Number
});

var MdrVariants = new Schema({
  _creator         : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  mdr_site         : Number,
  site_gene_start  : Number,
  drug_class       : Mixed,
  drug_report      : Mixed,
  coverage         : Number,
  wildtype         : Number,
  wildtype_prcnt   : Number,
  resistance       : Number,
  resistance_prcnt : Number,
  ci               : Mixed,
  other            : Number,
  other_prcnt      : Number,
  entropy          : Number,
  mu               : Number,
  mu_rnk_prctl     : Number
});

var MuRateClasses = new Schema({
  _creator    : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  num_rates  : Number,
  rate_class : Number,
  mu_rate    : Number,
  weight     : Number,
  log_lk     : Number,
  aic        : Number
});

var NucAlignment = new Schema({
  _creator       : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  a              : Number,
  ambig          : Number,
  c              : Number,
  consensus      : String,
  coverage       : Number,
  del            : Number,
  g              : Number,
  indel_position : Number,
  position       : Number,
  reference      : String,
  t              : Number
});

var Sequences = new Schema({
  _creator             : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  aligned              : String,
  aligned_aa           : String,
  aligned_aa_ref       : String,
  aligned_notclean     : String,
  aligned_notclean_ref : String,
  length               : Number,
  nuc_pass2            : String,
  offset               : Number,
  offset_nuc           : Number,
  offset_pass2         : Number,
  raw                  : String,
  rc                   : Number,
  ref_pass2            : String,
  score                : Number,
  score_pass2          : Number,
  sequence_id          : UNIQUE, //This needs to be changed to Index
  span                 : Number,
  span_pass2           : Number,
  stage                : Number,
  toolong              : Number,
  tooshort             : Number
});

var Settings = new Schema({
  _creator                 : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  dual_infection_threshold : Number,
  exp_per_base_score       : Number,
  genetic_code             : String,
  min_copies               : Number,
  min_coverage             : Number,
  min_dr_coverage          : Number,
  min_length               : String,
  options                  : String,
  prot_score_matrix        : String,
  reference                : String,
  reference_pass2          : String,
  run_date                 : Date,
  stanford_score           : Number,
  sw_size                  : Number,
  sw_stride                : Number,
  threshold                : Number,
  threshold_pass2          : Number
});

var SiteDrPosteriors = new Schema({
  _creator        : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  mdr_site        : Number,
  site_gene_start : Number,
  coverage        : Number,
  resistance      : Number,
  rate_class      : Number,
  rate            : Number,
  weight          : Number,
  posterior       : Number
});

var SiteMuRates = new Schema({
  _creator          : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  site              : Number,
  coverage          : Number,
  consensus         : Number,
  entropy           : Number,
  mu                : Number,
  mu_rnk_prcnt      : Number
});

var SitePosteriors = new Schema({
  _creator   : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  site       : Number,
  coverage   : Number,
  consensus  : Number,
  rate_class : Number,
  rate       : Number,
  weight     : Number,
  posterior  : Number
});

var UdsFileInfo = new Schema({
  _creator  : { type   : Schema.Types.ObjectId, ref : 'Uds' },
  sequences : Number,
  timestamp : Number,
  original  : String
});

var UdsQcStats = new Schema({
  _creator    : { type : Schema.Types.ObjectId, ref : 'Uds' },
  read_type   : String,
  mean        : Number,
  median      : Number,
  variance    : Number,
  sd          : Number,
  min         : Number,
  lowerprcntl : Number,
  upperprcntl : Number,
  max         : Number
});

module.exports = mongoose.model('Uds', Uds);
module.exports = mongoose.model('UdsParameters', UdsParameters);

