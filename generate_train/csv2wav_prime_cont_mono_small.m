% Copyright 20/7/2018 Tom Collins

% This script loads stimuli from CSV and JSON files, then assembles and
% writes the corresponding audio stimuli to file.

% Parameters
user = 'tom';
% user = 'iris';
% user = 'berit';
instrNam = 'keyboard_acoustic_000';
Fs = 16000;
fadeOut = 0.075;

% Paths.
if strcmp(user, 'tom')
  basePath = fullfile('~', 'Shizz', 'Lehigh', 'Projects', 'MIREX', '2018');
  sourceWav = fullfile(basePath, '20180721', instrNam);
  sourceDescr = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'descriptor');
  % Primes.
  sourceCsv = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'prime_csv');
  destWav = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'prime_wav');
  csv2wav(sourceCsv, destWav, sourceDescr, sourceWav, instrNam, Fs, fadeOut);
  % True continuations.
  sourceCsv = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'cont_true_csv');
  destWav = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'cont_true_wav');
  csv2wav(sourceCsv, destWav, sourceDescr, sourceWav, instrNam, Fs, fadeOut);
  % Foil continuations.
  sourceCsv = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'cont_foil_csv');
  destWav = fullfile(basePath, '20180725', 'PPDD-Jul2018', 'audio',...
    'monophonic', 'small', 'cont_foil_wav');
  csv2wav(sourceCsv, destWav, sourceDescr, sourceWav, instrNam, Fs, fadeOut);
  
  
elseif strcmp(user, 'iris')
  
else
  
end
