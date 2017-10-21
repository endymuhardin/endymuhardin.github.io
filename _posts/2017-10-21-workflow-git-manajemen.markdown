---
layout: post
title: "Workflow Git untuk Manajemen Pengembangan Aplikasi"
date: 2017-10-21 07:00
comments: true
categories:
- aplikasi
---

<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/gitgraph.js/1.11.4/gitgraph.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/gitgraph.js/1.11.4/gitgraph.min.js"></script>
<script src="{{site.url}}/files/artivisi-gitgraph.js"></script>

Pada artikel sebelumnya, kita sudah membahas tentang workflow development baik [sebagai kontributor](https://software.endy.muhardin.com/aplikasi/workflow-git-kontributor/) maupun [sebagai maintainer](https://software.endy.muhardin.com/aplikasi/workflow-git-maintainer/). Dengan dua artikel tersebut, kita sudah bisa membuat perubahan dalam source code, dan juga bisa menerima dan mengintegrasikan hasil pekerjaan orang lain ke repo utama.

Walaupun demikian, kita belum membahas bagaimana cara mengelola siklus pengembangan aplikasi. Kita terutama ingin mengatasi beberapa permasalahan berikut:

* bagaimana semua kontributor bisa bekerja sama dengan baik
* bagaimana memastikan kode program yang dihasilkan oleh kontributor bisa direview dengan seksama
* bagaimana melakukan rilis ke testing server dan production
* bagaimana menangani bug yang terjadi di production sambil tetap mengerjakan development untuk versi selanjutnya
* bagaimana meng-copy bugfix yang sudah kita kerjakan di atas production release (hotfix) ke development
* bagaimana mengotomasi proses rilis menggunakan continuous integration/delivery

**TLDR;** Workflow yang kita gunakan di ArtiVisi adalah sebagai berikut:

* single permanent branch : master
* develop di topic branch
* push branch ke remote
* raise pull request dari branch
* merge pull request
* hapus branch setelah merge
* deploy ketika ada tag dibuat

    * `A.B.C-M.xxx` : deploy ke dev (otomatis)
    * `A.B.C-RC.xxx` : deploy ke test (otomatis)
    * `A.B.C-RELEASE` : deploy ke production (manual)

* bugfix di release branch, kemudian merge ke master

Visualisasinya seperti ini

<div style="overflow: auto;">
    <canvas id="gitGraphHorizontal"></canvas>
</div>


Berikut penjelasan versi panjangnya ...

<!--more-->

Di internet banyak ditemukan berbagai workflow manajemen proyek yang populer, diantaranya:

* [GitFlow](http://nvie.com/posts/a-successful-git-branching-model/)
* [Git Developer Workflow](https://www.kernel.org/pub/software/scm/git/docs/gitworkflows.html)
* [Github Flow](http://scottchacon.com/2011/08/31/github-flow.html)
* [Gitlab Flow](https://about.gitlab.com/2016/07/27/the-11-rules-of-gitlab-flow/)
* [Trunk Based Development](https://trunkbaseddevelopment.com/)

Berbagai metodologi di atas semua ingin mengatasi masalah yang telah kita sebutkan di atas. Semua tujuannya sama, tapi ada perbedaan dalam urutan prioritas masalah-masalah tersebut. Sebagai contoh, Gitlab flow memprioritaskan kerja paralel antara development, testing, production, dan hotfix. Trunk based development memprioritaskan continuous delivery. Gitlab flow mengutamakan code review dan CI/CD. Github flow mengutamakan kecepatan rilis ke production.

Semua workflow di atas bisa mengatasi semua masalah yang telah kita sebutkan, tapi dengan prioritas yang berbeda-beda. Oleh karena itu, tidak ada satu metodologi yang paling hebat dan cocok untuk seluruh kondisi. Kita harus menentukan sendiri workflow yang paling cocok untuk kondisi kita sendiri.

Setelah mempelajari dan mencoba semua workflow di atas, berikut beberapa poin kesimpulan yang saya dapatkan :

## Git Flow ##

Gitflow adalah workflow yang paling pertama populer. Ini terutama didukung oleh infografis yang indah dan penjelasan yang gamblang. Selama tahun-tahun awal boomingnya Git, dialah satu-satunya workflow yang dijelaskan secara detail di internet. Oleh karena itu, banyak yang mengadopsinya dan bahkan membuatkan script khusus untuk menjalankannya.

[![Gitflow]({{site.url}}/images/uploads/2017/git-workflow/gitflow.png)]({{site.url}}/images/uploads/2017/git-workflow/gitflow.png)

Berjalan beberapa tahun, setelah banyak orang yang mahir menggunakan Git, mulailah banyak terjadi kritik terhadap Gitflow. Detailnya bisa dibaca [di sini](http://endoflineblog.com/gitflow-considered-harmful) dan [di sini](https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/). Pada intinya, berikut poin-poin para kritikus tadi:

* Terlalu kompleks. Para kritikus menyatakan bahwa kalau sampai dibuatkan scriptnya, berarti terlalu sulit untuk bisa dijalankan oleh manusia biasa. Ini akan menjadi masalah kalau ada programmer baru bergabung. Bisa habis satu pekan sendiri untuk menjelaskannya.
* Terlalu banyak branch. Branch develop harusnya tidak perlu ada

Walaupun demikian, kita bisa mengambil hal positif dari Gitflow, yaitu caranya mengelola release branch.

## Git Developer Workflow ##

Ini adalah workflow yang digunakan tim pengembang Git itu sendiri. Workflow ini memiliki 3 permanent branch, yaitu :

* `maint` : berisi semua commit yang akan diikutkan pada rilis `maintenance` berikutnya. Rilis `maintenance` artinya pengembangan dari versi yang sudah dirilis, biasanya berupa tuning performance, perbaikan implementasi, bugfix, dan perubahan minor lainnya. Biasanya maintenance rilis menaikkan minor version, misalnya dari `1.1.0` ke `1.1.1` atau `1.2.0`.
* `master` : berisi semua commit untuk rilis besar berikutnya, misalnya dari `1.2.4` ke `2.0.0`
* `next` : branch untuk mengintegrasikan dan mengetes kontribusi sebelum masuk ke `master`

Selain itu, ada satu lagi branch yang selalu ada, tapi sering dihapus dan dibuat ulang, yaitu :

* `pu` atau proposed update. Branch ini dibuat pada saat ingin dilakukan integrasi dan pengetesan dari seluruh kontribusi committer.

## Trunk Based Development ##

Ini adalah praktek yang sudah dijalankan sejak jaman awal dibuatnya version control dahulu kala. Trunk artinya branch utama, di Git biasa disebut `master`. Di antara yang menggunakan metode ini adalah [Google](https://trunkbaseddevelopment.com/game-changers/index.html#google-revealing-their-monorepo-trunk-2016) dan Microsoft.

[![Trunk Flow]({{site.url}}/images/uploads/2017/git-workflow/trunk-based-development.png)]({{site.url}}/images/uploads/2017/git-workflow/trunk-based-development.png)

Beberapa praktek yang dijalankan oleh aliran ini:

* semua programmer commit ke branch utama (`trunk` : istilah Subversion, `master` : istilah Git).
* hotfix dilakukan di trunk, kemudian di-cherry pick ke release branch. Praktek ini disebut dengan istilah upstream-first-policy.

Penggunaan `trunk` atau `master` sebagai single permanent branch sangat menyederhanakan proses. Branch `master` sudah otomatis dibuatkan oleh Git pada waktu kita membuat repository ataupun melakukan clone. Jadi semua programmer pasti punya.

Upstream first policy juga menarik. Idenya adalah dengan melakukan fix di master, maka bug akan selesai untuk selamanya. Bila kita kerjakan di release branch, maka nanti ada kemungkinan programmernya lupa memasukkannya ke trunk sehingga pada waktu kita rilis dari master, bug tersebut akan muncul lagi. Ini disebut dengan istilah `regression bug`.

Walaupun demikian, policy ini tidak selalu bisa dilakukan karena :

* Bugnya belum tentu masih ada di master. Bisa jadi fitur tersebut sudah mengalami modifikasi signifikan, atau bahkan dihilangkan.
* Agar bisa di-cherry-pick ke release branch, commitnya harus benar-benar bersih. Bila kondisi sebelum fix berbeda dengan kondisi di release branch, bisa jadi cherry-pick tidak bisa diaplikasikan.

## Metode Lain ##

Secara garis besar, metode lain seperti Github Flow, Gitlab Flow, Bitbucket Flow, dan lainnya tidak jauh berbeda. Gitlab Flow misalnya, memaksimalkan fitur CI/CD Gitlab yang mampu mengetes feature branch, sehingga dia mempromosikan pembuatan Issue, Feature Branch, dan Merge Request.

## ArtiVisi Flow ##

Setelah membaca itu semua, akhirnya kami mencoba merumuskan metodologi yang sesuai dengan kebutuhan internal kami. Beberapa kriteria yang digunakan antara lain:

* Mudah dipahami. Kami di ArtiVisi banyak menerima anak magang dan fresh graduate. Oleh karena itu, prosedur penggunaan Git harus bisa dipahami dalam beberapa jam saja.
* Mengakomodasi code review. Untuk anak magang dan karyawan baru, kita tidak bisa begitu saja langsung memasukkan semua commit ke master. Apalagi kita juga ada beberapa project open source yang kontributornya kadang hanya menyumbang satu commit saja.
* Bisa diotomasi dengan CI/CD. Jaman now begini, masa masih harus deploy manual.
* Mengakomodasi maintenance release. Artinya, kita ingin tetap menyediakan bugfix untuk versi 2.x sementara kita develop 3.x

Hasilnya, kami menggunakan beberapa panduan berikut:

* Permanent branch hanya satu, yaitu `master` : menampung semua kegiatan development
* Untuk melakukan development, semua orang membuat topic branch seperti dijelaskan di [artikel terdahulu](https://software.endy.muhardin.com/aplikasi/workflow-git-kontributor/). Committer senior boleh langsung merge ke master, anak magang dan freshman harus direview dulu oleh committer senior. Bila oke, committer senior yang akan merge ke master.
* CI/CD dilakukan di `master` branch. Bila sukses, maka akan dideploy otomatis ke development server.
* Deployment ke testing, staging, production dilakukan menggunakan tag. Misalnya:

    * Tag `1.0.0-M.001` : deploy ke testing
    * Tag `1.0.0-RC.001` : deploy ke testing lain atau staging
    * Tag `1.0.0-RELEASE` : deploy ke production

* Bila ada bug di production, misalnya ada bug dengan nomer `111` di rilis `1.2.2-RELEASE`, maka:

    * Buat branch untuk memperbaiki bug. Branch diambil dari tag `1.2.2-RELEASE` di master

            git checkout -b fix-111 1.2.2-RELEASE

    * Lakukan bugfixing dan test di sana. Di sini harusnya nanti ada tag `1.2.3-M.xxx` dan `1.2.3-RC.xxx`.

    * Setelah oke, tag `1.2.3-RELEASE`

            git tag 1.2.3-RELEASE

    * Merge ke master

            git checkout master
            git merge fix-111

    * Hapus fix branch di local dan remote

            git branch -d fix-111
            git push :fix-111 remotename

### Visualisasi ##

Berikut adalah visualisasi dari skenario di atas.

<div style="overflow: auto;">
<canvas id="gitGraphVertical"></canvas>
</div>

Visualisasi dibuat menggunakan [Gitgraph.js](http://gitgraphjs.com/)


## Otomasi ##

Workflow di atas bisa diotomasi menggunakan Gitlab CI dengan script sebagai berikut:

```yml
image: alpine:latest

stages:
  - build
  - package
  - deploy

compile-test:
  stage: build
  script:
    - echo "Build $CI_COMMIT_SHA in branch $CI_COMMIT_REF_SLUG with tag $CI_COMMIT_TAG"

static-analysis:
  stage: build
  script:
    - echo "Static Code Analysis, parallel run with compiling"

build-dan-package:
  stage: package
  script:
    - echo "Build $CI_COMMIT_SHA in branch $CI_COMMIT_REF_SLUG with tag $CI_COMMIT_TAG"
    - cat README.md > README-$CI_COMMIT_SHA.md
    - echo "Version $CI_COMMIT_SHA" >> README-$CI_COMMIT_SHA.md
  artifacts:
    paths:
      - README-$CI_COMMIT_SHA.md

deploy-to-development:
  stage: deploy
  only:
    - /-M\./
  script:
    - echo "Deploy build" +$CI_COMMIT_SHA+ " to development server"
    - cat README-$CI_COMMIT_SHA.md

deploy-to-testing:
  stage: deploy
  only:
    - /-RC\./
  script:
    - echo "Deploy build" +$CI_COMMIT_SHA+ " to testing server"
    - cat README-$CI_COMMIT_SHA.md

deploy-to-production:
  stage: deploy
  only:
    - /-RELEASE$/
  when: manual
  script:
    - echo "Deploy build" +$CI_COMMIT_SHA+ " to production server"
    - cat README-$CI_COMMIT_SHA.md
```

Semoga bermanfaat.
