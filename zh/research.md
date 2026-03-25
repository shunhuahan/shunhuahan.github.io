---
layout: page
lang: zh
title: 研究
permalink: /zh/research/
---

我的研究处于计算方法开发与基因组学的交叉前沿。我构建算法和软件，用于检测基因组中过于复杂、重复或结构变异而无法用标准方法处理的区域中的遗传变异。

<div class="research-section">
<div class="research-section-header">
<h2>复杂基因组区域中的单倍型解析变异检测</h2>
</div>
<div class="research-section-body" markdown="1">

许多重要基因位于节段重复或高度重复的基因组区域，标准的短读长比对工具和变异检测工具在这些区域往往失效。我开发了靶向、单倍型感知的方法，综合利用全基因组测序（短读长和长读长），在这些挑战性位点实现精确的变异检测。

**基于TruPath Genome（前身为Constellation）的节段重复区域单倍型解析变异检测**

TruPath Genome是一种流式芯片邻近测序技术。通过对来自相邻纳米孔的测序读段的邻近信息，可以推断一组读段是否来源于同一原始DNA分子。我设计了多区域联合检测（MRJD）算法，能够利用TruPath Genome提供的长程信息，在节段重复区域中实现单倍型解析的变异检测。

我在2026年ACMG年度临床遗传学会议上以口头报告的形式发表了这项工作：*"A Rapid, Novel Approach to Rare Disease and Clinical Genetic Variant Discovery using On-flowcell Proximity Sequencing and Haplotype-resolved Variant Calling."* [[摘要]](https://www.gimopen.org/article/S2949-7744(26)00818-6/fulltext)

**其他主要项目：**

- **甲型地中海贫血（*HBA1/2*）拷贝数基因分型** — 开发了针对α-珠蛋白位点的靶向拷贝数检测工具，该位点是基因组中结构最复杂、临床最重要的区域之一（全球甲型地中海贫血携带率约5%）。[[博客]](https://www.illumina.com/science/genomics-research/articles/HBA-targeted-caller.html)

- **林奇综合征（*PMS2*）变异检测** — 提高了*PMS2*中变异检测的准确性，该基因具有高度相似的假基因（*PMS2CL*），导致广泛的比对错误和假阳性变异。[[博客]](https://www.illumina.com/science/genomics-research/articles/PMS2-small-variant-detection.html)

</div>
</div>

<div class="research-section">
<div class="research-section-header">
<h2>果蝇转座元件的检测与分析</h2>
</div>
<div class="research-section-body" markdown="1">

转座元件（TE）占人类基因组近一半，是基因组变异的主要驱动力。在攻读博士期间，我开发了利用长读长测序技术检测、表征和研究TE的计算方法。

**主要项目：**

- **[TELR](https://github.com/bergmanlab/TELR)** — 一种软件流程，利用长读长（PacBio / Oxford Nanopore）测序数据的局部组装，在碱基对分辨率下检测非参考TE插入，支持TE插入的系统发育基因组学分析。发表于*Nucleic Acids Research*（2022年）。

- **[ngs\_te\_mapper2](https://github.com/bergmanlab/ngs_te_mapper2)** — 基于TE插入谱的细胞系鉴定工具，用于识别*果蝇*细胞系并检测杂合性丢失。

- ***果蝇* S2细胞系中的TE动态** — 对32个*果蝇黑腹果蝇* S2亚系全基因组数据集进行基因组学分析，表征实验室细胞培养中持续转座活动及系统发育关系。

- ***P*元素靶位点预测** — 训练了基于30余个工程化特征的机器学习模型，用于预测*P*元素插入位点偏好。

</div>
</div>

<div class="research-section">
<div class="research-section-header">
<h2>软件与资源</h2>
</div>
<div class="research-section-body" markdown="1">

| 工具 | 描述 | 链接 |
|------|------|------|
| TELR | 长读长WGS中的TE检测 | [GitHub](https://github.com/bergmanlab/TELR) |
| ngs_te_mapper2 | 细胞系TE谱分析 | [GitHub](https://github.com/bergmanlab/ngs_te_mapper2) |
| McClintock 2 | TE检测工具基准评测 | [GitHub](https://github.com/bergmanlab/mcclintock) |

</div>
</div>

<style>
.research-section {
  margin: 28px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.research-section-header {
  background: #2e5b9e;
  padding: 14px 24px;
}
.research-section-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
  border: none;
}
.research-section-body {
  background: #ffffff;
  padding: 20px 24px;
}
.research-section-body p:first-child { margin-top: 0; }
.research-section-body p:last-child  { margin-bottom: 0; }
html.dark .research-section { border-color: #334155; }
html.dark .research-section-header { background: #1e4585; }
html.dark .research-section-body { background: #1e293b; }
html.dark .research-section-body,
html.dark .research-section-body p,
html.dark .research-section-body li { color: #cbd5e1; }
html.dark .research-section-body strong { color: #e2e8f0; }
html.dark .research-section-body table tr { background-color: #1e293b; border-top-color: #334155; }
html.dark .research-section-body table tr:nth-child(2n) { background-color: #253347; }
html.dark .research-section-body table tr th,
html.dark .research-section-body table tr td { border-color: #334155; color: #cbd5e1; }
</style>
