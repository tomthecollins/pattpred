#| Copyright Tom Collins 18/7/2018

This script selects 5800 songs at random from the Lakh
dataset and copies them to a folder. What we really want
is a dataset of size 1000 -- hopefully 5800 should be
enough with some input not turning into output. |#

(setq
 *rs*
 #.(CCL::INITIALIZE-MRG31K3P-STATE 2114456260 46916995
    292469660 407061270 240491402 2135438499))
(setq randn 5800)
(setq
 *lakh-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Data" "Music"
    "lmd_full")))
(setq
 *out-dir*
 (make-pathname
  :directory
  '(:absolute
    "Users" "tomthecollins" "Shizz" "Lehigh" "Projects"
    "MIREX" "2018" "20180725" "PPDD-Jul2018" "symbolic"
    "polyphonic" "medium" "orig_midi")))

; Get total number of files in each Lakh subdir.
(setq *lakh-dir-list* (list-directory *lakh-dir*))
(setq
 *lakh-subdirs*
 (loop for i from 0 to (- (length *lakh-dir-list*) 1)
      when
      (not (pathname-type (nth i *lakh-dir-list*)))
      collect (nth i *lakh-dir-list*)))
(setq
 *lakh-subdirs-nos*
 (mapcar
  #'(lambda (x) (length (list-directory x)))
  *lakh-subdirs*))
(setq
 *incrementing-totals*
 (fibonacci-list *lakh-subdirs-nos*))
(setq
 *rand-idx*
 (loop for i from 0 to (- randn 1) collect
   (random (my-last *incrementing-totals*) *rs*)))
(setq
 *rand-idx-no-dupes* (remove-duplicates *rand-idx*))
"Yes!"
(setq *rand-idx* *rand-idx-no-dupes*)

; Grab appropriate directory and file for each selection.
(loop for i from 0 to (- (length *rand-idx*) 1) do
  (progn
    (setq
     rel-idx
     (index-1st-sublist-item>
      (nth i *rand-idx*)
      (cons 0 *incrementing-totals*)))
    (setq
     sub-idx
     (-
      (nth i *rand-idx*)
      (nth (- rel-idx 1) (cons 0 *incrementing-totals*))))
    (setq
     file-in
     (nth
      sub-idx
      (list-directory
       (nth (- rel-idx 1) *lakh-subdirs*))))
    (setq
     file-out
     (merge-pathnames
      (make-pathname
       :name (pathname-name file-in)
       :type "mid") *out-dir*))
    (copy-file file-in file-out)))
