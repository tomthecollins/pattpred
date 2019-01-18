#| Copyright Tom Collins 18/7/2018.

Script for loading CSV files of onsets, MIDI note
numbers, etc. and exporting to MIDI files. |#

; PRIMES!
#| Set some paths. |#
(setq
 *csv-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "prime_csv")))
(setq
 *midi-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "prime_midi")))
(setq
 *fnam*
 (list-directory *csv-dir*))

(loop for i from 0 to (- (length *fnam*) 1) do
  (if (equalp (pathname-type (nth i *fnam*)) "csv")
      (progn
        (setq
         *piece-name* (pathname-name (nth i *fnam*)))
        ; Import.
        (setq
         data
         (csv2dataset
          (merge-pathnames
           (make-pathname
            :name *piece-name* :type "csv")
           *csv-dir*)))
        (setq first-ontime (floor (first (first data))))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (append
               (list (- (first x) first-ontime))
               (rest x)))
          data))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (list
               (round (* 1000 (first x)))
               (second x)
               (round (* 1000 (fourth x)))
               (+ (fifth x) 1)
               84))
          dataset))
        ; Export.
        (saveit
         (merge-pathnames
          (make-pathname
           :name *piece-name* :type "mid") *midi-dir*)
         dataset nil)
        )))


; TRUE CONTINUATIONS!
#| Set some paths. |#
(setq
 *csv-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "cont_true_csv")))
(setq
 *midi-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "cont_true_midi")))
(setq
 *fnam*
 (list-directory *csv-dir*))

(loop for i from 0 to (- (length *fnam*) 1) do
  (if (equalp (pathname-type (nth i *fnam*)) "csv")
      (progn
        (setq
         *piece-name* (pathname-name (nth i *fnam*)))
        ; Import.
        (setq
         data
         (csv2dataset
          (merge-pathnames
           (make-pathname
            :name *piece-name* :type "csv")
           *csv-dir*)))
        (setq first-ontime (floor (first (first data))))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (append
               (list (- (first x) first-ontime))
               (rest x)))
          data))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (list
               (round (* 1000 (first x)))
               (second x)
               (round (* 1000 (fourth x)))
               (+ (fifth x) 1)
               84))
          dataset))
        ; Export.
        (saveit
         (merge-pathnames
          (make-pathname
           :name *piece-name* :type "mid") *midi-dir*)
         dataset nil)
        )))


; FOIL CONTINUATIONS!
#| Set some paths. |#
(setq
 *csv-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "cont_foil_csv")))
(setq
 *midi-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "small" "cont_foil_midi")))
(setq
 *fnam*
 (list-directory *csv-dir*))

(loop for i from 0 to (- (length *fnam*) 1) do
  (if (equalp (pathname-type (nth i *fnam*)) "csv")
      (progn
        (setq
         *piece-name* (pathname-name (nth i *fnam*)))
        ; Import.
        (setq
         data
         (csv2dataset
          (merge-pathnames
           (make-pathname
            :name *piece-name* :type "csv")
           *csv-dir*)))
        (setq first-ontime (floor (first (first data))))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (append
               (list (- (first x) first-ontime))
               (rest x)))
          data))
        (setq
         dataset
         (mapcar
          #'(lambda (x)
              (list
               (round (* 1000 (first x)))
               (second x)
               (round (* 1000 (fourth x)))
               (+ (fifth x) 1)
               84))
          dataset))
        ; Export.
        (saveit
         (merge-pathnames
          (make-pathname
           :name *piece-name* :type "mid") *midi-dir*)
         dataset nil)
        )))


