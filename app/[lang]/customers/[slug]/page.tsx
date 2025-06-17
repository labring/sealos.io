import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { appDomain } from '@/config/site';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TocSidebar from '../components/toc-sidebar';

// Define types for case study data
type Metric = { value: string; label: string };
type ContentSection = { title: string; markdown: string };

type CaseStudy = {
  title: string;
  description: string;
  logo: string;
  industry: string;
  companyName: string;
  quote: { text: string; author: string; title: string };
  metrics: Metric[];
  content: ContentSection[];
  getStarted: string;
  backToAllCases: string;
};

type CaseStudies = {
  [lang in languagesType]: {
    [slug: string]: CaseStudy;
  };
};

// Sample case studies data
const caseStudies: CaseStudies = {
  'en': {
    // Add more case studies as needed
  },
  'zh-cn': {
    'teable': {
      title: 'Teable 通过 Sealos 降低了 80% 的基础设施成本',
      description: '了解开源多维表格项目 Teable 如何使用 Sealos 实现自动化 CICD、预览环境，大幅提升开发者效率，降低运维成本。',
      logo: '/images/customers/teable.webp',
      industry: '低代码',
      companyName: 'Teable',
      quote: {
        text: "Sealos 让我在运维上的时间投入 ROI 变得异常的高，不需要再浪费时间在那些消耗生命的事情上。",
        author: "陈加贝",
        title: "Teable 创始人"
      },
      metrics: [
        { value: '80%', label: '基础设施成本降低' },
        { value: '3倍', label: '部署速度提升' },
        { value: '99.9%', label: '系统可用性' }
      ],
      content: [
        {
          title: '关于 Teable',
          markdown: `
以 [Airtable](https://www.airtable.com/) 和 [Notion](https://www.notion.so/) 为代表的电子表格数据库，展现了一个令人兴奋的方向：让不懂代码的业务人员也能搭建自己需要的业务系统。但随着深入，Teable 团队发现现有产品都存在难以突破的核心矛盾：性能瓶颈、数据安全和开放能力。

与市面上其他产品不同，[Teable](https://github.com/teableio/teable) 的核心理念是 “数据库平权”。该团队观察到，用户对多维表格的期望远不止是一个更强大的电子表格，而是希望它能真正承载核心业务数据和应用。

Teable 的目标是**将专业的数据库能力通过无代码界面开放给所有人**。他们想要把原本给开发者用的专业数据库，变成让不懂代码的人也能使用的无代码工具。数据库不应该只是技术人员的工具，而是要成为支撑任何团队的业务应用的工具。

这促使他们启动了 Teable 项目。他们的思路很直接：
-   首先，通过开源确保数据完全可控
-   其次，支持百万级数据像呼吸一样自然
-   最后，让数据库保持像表格一样简单易用

这样各行各业的业务人员可以直接在数据库上面轻松搭建像客户管理、项目追踪、订单管理、行业定制数据系统等任意的管理系统，而且还可以轻松的与现有的数据系统和工具进行集成，在搭建好的应用上搭建进一步的自动化数据处理，数据洞察，和第三方应用。

![Teable 平台截图：业务人员无需代码即可搭建数据库驱动的管理系统](/images/customers/teable/teable-no-code-database-platform-overview.png)

选择开源是他们深思熟虑的结果。他们相信，专业的数据库能力应该触手可及，数据的掌控权应该回到用户手中。非常幸运这个理念得到了广泛认可：在开源后的 8 个月里，Teable 在几乎零推广的情况下获得了 1.3 万 Github stars，多次登顶 Github trending。目前用户已遍布 100 多个国家和地区，并入选 Runa 2024Q2 最具潜力开源项目榜单。

![Teable 入选 Runa Capital 2024年第二季度最具潜力开源初创项目榜单截图。](/images/customers/teable/teable-runa-capital-oss-index-q2-2024.png)
          `
        },
        {
          title: '当开发者遇上运维难题',
          markdown: `
在项目发展过程中，Teable 团队面临了一系列技术基础设施方面的挑战。他们并不希望把宝贵的时间浪费在处理运维问题上。

### 手工部署的困境

一开始团队采用了最简单的方案 - 购买服务器自行部署 Docker 容器。他们认为用户也不多，买个服务器用 Docker 起几个容器应该够用了。但很快，问题接踵而至：

-   数据库、对象存储、Redis 等中间件的管理
-   SSL 证书更新和 CICD 流程的维护
-   系统稳定性问题 (如内存不足)
-   扩容时的各种技术细节

**这些跟业务无关的事情浪费了他们大量时间**，比如每个中间件都要单独买，成本比部署应用本身还高。而且经常会遇到内存不够、整个系统 crash 的情况，排查起来特别痛苦。

### 寻找更好的方案

一开始也试过各种大型云厂商 (比如 AWS 等) 的容器服务，但是需要**单独部署一套 K8s 集群**，维护成本很高，而且**配置很复杂**，团队成员根本就搞不定，不知道那么多选项是什么意思。

后来又试过 Railway 这种海外的创新 PaaS 平台，他们的用户体验确实做得很好，但是也有问题，虽然它屏蔽了底层细节，但是**并没有为高级玩家提供高级功能的访问入口**，比如**开发者**想进到容器里去调试，Railway 目前是不支持的。除此之外，Railway **只适合海外使用**，国内访问速度较慢，无法满足国内的业务需求。

最终**Teable 团队**在海外环境选择了使用 Railway 来部署，但是国内环境还得继续探索。

在寻找国内部署方案的过程中，他们也尝试过自建 K8s 集群。但这个过程让他们深刻体会到了中小团队在运维方面的挑战：

- **首先**是学习成本。K8s 本身就是一个庞大的系统，涉及大量概念和配置项。即使是有经验的开发者，要完全掌握也需要投入大量时间。对于像 Teable 这样以产品开发为主的团队来说，这种投入性价比并不高。

- **其次**是维护难度。搭建好集群只是第一步，后续还要处理各种运维问题：
   -   节点扩容和缩容
   -   监控和告警配置
   -   日志收集和分析

- **最后**是稳定性问题。由于缺乏专业运维经验，他们部署的集群经常会出现一些意想不到的问题。比如某次节点突然不可用，排查了很久才发现是磁盘空间不足导致的。这些问题不仅影响了**他们**的开发效率，也给用户体验带来了负面影响。

**作为开发者，他们更希望把精力放在产品本身，而不是基础设施的维护上**。因此，他们需要一个既能满足技术需求，又容易维护的方案。
          `
        },
        {
          title: '为什么选择 Sealos？',
          markdown: `
在经历了多次尝试后，Teable 团队最终选择了 [Sealos](https://sealos.run) 作为其国内环境的基础设施方案。

Sealos 的设计理念和 Teable 很像，就是把复杂的技术通过简单的界面提供给用户，但又不限制高级用户的发挥空间。

![](https://images.tryfastgpt.ai/forum/2024-12-03-17-31-tiJru5.png)

具体来说，Sealos 解决了几个关键问题：

-   **统一管理中间件**：[数据库](/docs/guides/databases/postgresql)、对象存储这些，都是标准的开源组件，不用担心被锁定。而且这些中间件可以一键部署，无需单独购买和维护 K8s 集群。
-   **简单易用且收放自如**：Sealos 屏蔽了 K8s 的复杂性，提供了直观的操作界面，操作体验简单直观。同时，Sealos 也保留了 K8s 的高级功能，他们可以根据需要进行灵活配置。
-   **成本合理**：之前单独买云数据库的钱，都比部署应用本身还贵。现在该团队只需要为应用付费，不管是业务应用本身，还是中间件，都是按需付费。

上了 Sealos 之后，因为自身原因宕机的事情就没发生过了。他们开玩笑说，如果再出问题，终于可以将责任归咎于平台方了。

从投入产出比来看，Sealos 让该团队在运维上的时间投入 ROI 变得异常的高，他们不需要再浪费时间在那些消耗生命的事情上。就算团队成员需要学习一点 K8s，学到的也都是能直接用的知识，学到就是赚到。
          `
        },
        {
          title: '实施历程：从复杂到简单的转变',
          markdown: `
### 架构设计理念

在做架构设计时，Teable 团队秉持着 less is more 的理念。尽量用最简单的架构来解决复杂的问题。

![Teable 整体架构设计图](/images/customers/teable/teable-architecture-design-diagram.png)

Teable 的整体架构包含以下几个部分：

1. 无状态应用
- 前后端打包在同一个 Docker 镜像中
- 支持横向扩展
- 便于部署和维护

2. 核心中间件
- PostgreSQL 数据库 (必需)
- Redis 缓存和消息队列 (可选)
- MinIO 对象存储 (可选)

Teable 团队特意设计了降级方案，即使没有 Redis 或对象存储，应用也能运行，只是横向扩展会受限。

### 标准化部署流程

[Sealos 的应用商店](https://sealos.run/docs/5.0.0/user-guide/app-store/)是个很棒的功能，它就和 macOS 的应用商店一样，可以一键安装应用，只不过安装的是云上的分布式应用。

![Sealos 应用商店界面](/images/customers/teable/sealos-app-store-interface.png)

借助 Sealos 应用商店，Teable 团队实现了高度标准化的部署流程，直接使用 Sealos 提供的应用模板，一键部署应用以及所有中间件依赖，自动完成配置和连接。

![使用 Sealos 应用模板一键部署 Teable 应用及其依赖项](/images/customers/teable/sealos-teable-one-click-deployment.png)

Sealos 还为每个用户提供了特定权限的 kubeconfig 文件，Teable 团队可以直接使用它来连接到集群，不需要再手动配置。

![Sealos 平台提供用于直接连接集群的特定权限 kubeconfig 文件](/images/customers/teable/sealos-get-kubeconfig-file.png)

借助 kubeconfig，Teable 团队通过 GitHub Actions 实现了应用的自动化更新。核心 Workflow 代码如下：

![Teable 使用 GitHub Actions 和 kubeconfig 实现自动化部署 (CD) 的核心 Workflow 代码片段](/images/customers/teable/teable-github-actions-cd-workflow-code.png)

完整的 Workflow 可以参考：[https://github.com/teableio/teable/blob/develop/.github/workflows/manual-preview.yml](https://github.com/teableio/teable/blob/develop/.github/workflows/manual-preview.yml)

以前要花好几天才能搭建的环境，有了 Sealos 之后，现在几分钟就能完成，这样Teable 团队就能把更多精力放在产品研发上。

### 预览环境自动化

既然有了 kubeconfig，预览环境也完全可以自动化了。

和生产环境部署类似，Teable 团队基于 Sealos 应用商店提供的 yaml 模板，通过 kubectl apply 创建预览环境，自动分配资源和配置。

![用于通过 kubectl apply 创建 Teable 预览环境的 Sealos YAML 模板示例代码](/images/customers/teable/sealos-preview-environment-yaml-template.png)

> Sealos 应用商店所有应用的 yaml 模板可以在[这个仓库](https://github.com/labring-actions/templates)里找到。

现在，Teable 团队的工作流程是这样的：

1. 开发提交 PR
2. 自动创建预览环境
3. 测试、review 都在预览环境进行
4. 合并后自动清理资源

![Teable 团队自动化预览环境工作流程：从提交 PR 到自动创建、测试、合并和清理](https://images.tryfastgpt.ai/forum/2024-12-03-18-34-2Arx8a.png)

他们本来觉得搭建预览环境肯定很复杂，结果只花了一两天时间就搞定了。

你知道这意味着什么吗？每个开发分支都能有独立的测试环境。测试完自动清理，完全不用操心。这种能力，就算有专业运维团队也不一定搞得定。

详情可参考：

- 创建预览环境的 workflow：[https://github.com/teableio/teable/blob/develop/.github/workflows/manual-preview.yml](https://github.com/teableio/teable/blob/develop/.github/workflows/manual-preview.yml)
- 预览环境清理的 workflow：[https://github.com/teableio/teable/blob/develop/.github/workflows/preview-cleanup.yml](https://github.com/teableio/teable/blob/develop/.github/workflows/preview-cleanup.yml)
          `
        }
      ],
      getStarted: '免费开始使用',
      backToAllCases: '返回所有案例'
    },
    'sinocare': {
      title: '三诺生物使用 Sealos 加速 AI 创新，构建慢病健康普惠新路径',
      description: '了解三诺生物如何借助 Sealos 平台，成功解决 AI 客服 “幻觉” 难题，实现客服效率提升 20%，成本降低 50%。',
      logo: '/images/customers/sinocare.png',
      industry: '医疗健康',
      companyName: '三诺生物',
      quote: {
        text: "我们现在的技术栈是 Sealos + 云开发 + FastGPT 的组合，这套方案既能通过 FastGPT 的流程编排降低开发门槛，又能用云开发实现定制化业务逻辑。比如最近客服希望 AI 收到的催发货的信息能发到企微，从需求提出到上线只用了 3 天。",
        author: "张依奔",
        title: "三诺算法工程师"
      },
      metrics: [
        { value: '20%', label: '客服效率提升' },
        { value: '50%', label: '资源成本降低' },
        { value: '10倍', label: '开发效率提升' }
      ],
      content: [
        {
          title: '关于三诺生物',
          markdown: `
![三诺公司总部大楼](/images/customers/sinocare/sinocare-company-headquarters.jpeg)

三诺是一家利用生物传感技术，针对慢性疾病患者和医疗健康专业人员，研发、生产、销售一系列快速诊断检测慢性疾病产品，并提供相关专业服务和糖尿病数字健康管理的高新技术企业；致力于为全球糖尿病及相关慢性疾病的人们提供创新、优质的产品和服务，帮助他们提高生活质量。

作为国内血糖监测领域的领军企业，三诺始终将创新作为企业发展的核心驱动力。随着 AI 技术的兴起，三诺敏锐地意识到 AI 在慢病管理、智能客服等领域的巨大潜力，并成立了专门的 AI 探索小组，积极探索 AI 技术的应用。
          `
        },
        {
          title: '面临挑战',
          markdown: `
三诺的 AI 探索小组最初聚焦于 AI 客服场景，希望通过 AI 技术提升客服效率，降低人力成本，改善用户体验。然而，在实际开发过程中，他们遇到了诸多挑战：

- **大模型幻觉问题**：大模型输出不稳定，经常出现 “一本正经地胡说八道” 的情况，导致客服质量难以保证。
- **开发部署复杂**：传统 AI 开发流程繁琐，需要编写大量代码，配置复杂环境，部署和运维难度大。
- **资源成本高昂**：AI 模型训练和推理需要大量的计算资源，传统模式下资源利用率低，成本居高不下。
- **团队协作困难**：AI 探索小组的成员并非都是专业的算法工程师，传统开发模式下，团队协作效率低，难以快速迭代。

我们之前的技术路径受限于 Langchain 框架，只有具备编程能力的团队成员才能做，而且在实际应用中我们发现，大模型直接输出存在 “幻觉” 现象，因为他经常说一些不着边际的话，就是一本正经地胡说八道，这种 AI 输出与业务需求脱节的问题，实际上是当前行业普遍面临的挑战。
          `
        },
        {
          title: '为什么选择 Sealos？',
          markdown: `
![Sealos 云操作系统](/images/customers/sinocare/sealos-cloud-operating-system-platform.png)

为了解决上述问题，三诺开始寻找更高效、更便捷的 AI 开发解决方案。在对比了多种方案后，他们最终选择了 Sealos。Sealos 之所以能够脱颖而出，主要得益于以下几个方面的优势：

1. **简化开发流程**：Sealos 提供了云开发和 Devbox 等工具，极大地简化了 AI 应用的开发流程。云开发允许开发者无需关心底层基础设施，只需编写业务逻辑代码即可快速部署应用。Sealos 团队的另一款产品 FastGPT 则提供了强大的 AI 编排能力，帮助开发者轻松构建复杂的 AI 应用。
2. **弹性资源调度**：Sealos 基于 Kubernetes 构建，具备强大的容器编排和资源调度能力，可以根据 AI 应用的实际需求自动调整计算资源，确保应用在高峰期也能稳定运行。
3. **高可用性保障**：Sealos 的容器化架构和 Kubernetes 的自愈机制，保证了 AI 应用的高可用性。即使出现故障，系统也能自动恢复，最大限度地减少服务中断时间。
4. **与阿里深度合作**：Sealos 与阿里云深度合作，底层基础设施跑在阿里云上，数据安全性和稳定性得到了充分保障。
          `
        },
        {
          title: '实施过程',
          markdown: `
在选择了 Sealos 之后，三诺的 AI 探索小组迅速开始了 AI 客服的开发和部署工作，完整技术路径可分为两个阶段：

**第一阶段：技术验证**

- 使用 FastGPT 的 UI 界面进行内部测试，快速验证 AI 客服核心功能
- 通过可视化编排实现：用户问题分类 → 知识库检索 → 大模型核验 → 结构化输出 → 人工抽查的完整流程
- 重点解决大模型 “幻觉” 问题：大模型只负责幕后任务，最终输出仍为客服审核过的话术和图片视频素材，杜绝捏造、错误引导、乱开药、乱诊断等问题

![三诺利用 FastGPT 构建的 AI 客服技术验证流程图，展示了问题分类、知识库检索到人工审核的步骤](/images/customers/sinocare/sinocare-fastgpt-ai-customer-service-workflow.png)

**第二阶段：生产部署**

1. **技术栈组合**
   - **Sealos**：采用 Sealos 云操作系统作为基础平台
   - **Sealos 云开发**：开发灰度调度、消息解析、记忆缓存、异常状态监测、Ican 平台 API 接入等定制功能模块
   - **FastGPT**：通过 API 对接三诺 APP 和 CRM 系统，日均服务 5\~6 千位用户，处理 2\~3 万次对话

2. **关键优化措施**：
   - 在 FastGPT 流程中增加双重校验机制：
      - 第一层：基于规则引擎的关键词过滤
      - 第二层：人工审核样本的持续学习
   - 采用 Sealos 弹性伸缩策略，应对早晚高峰流量波动 (峰值 QPS 从 15 提升到 45)

我们现在的技术栈是 Sealos + 云开发 + FastGPT 的组合，这套方案既能通过 FastGPT 的流程编排降低开发门槛，又能用云开发实现定制化业务逻辑。比如最近客服希望 AI 收到的催发货的信息能发到企微，从需求提出到上线只用了 3 天。

![三诺 AI 客服采用 Sealos、云开发与 FastGPT 组合的技术栈架构](/images/customers/sinocare/sinocare-sealos-fastgpt-tech-stack-architecture.png)
          `
        },
        {
          title: '效率提升 20%，成本降低 50%',
          markdown: `
通过使用 Sealos，三诺的 AI 客服开发取得了显著成效：

- **客服效率提升**：灰度测试中，AI 客服能够一次性解决约 **20%** 的用户问题，显著降低了人工客服的工作量。
- **开发效率提升**：开发周期从原来的几天缩短到几分钟，实现了 “一天和一分钟的区别”。
- **资源成本降低**：IT 硬件资源成本降低了 **50%** 以上。
- **团队协作改善**：非专业开发人员也能参与 AI 应用的开发和维护，团队协作效率大幅提升。
          `
        },
        {
          title: '未来展望',
          markdown: `
三诺计划未来将 Sealos 应用于更多的 AI 场景，并积极探索更多技术合作：

- **GPU 资源需求**：Sealos 接下来会上线独立的 GPU 可用区，以满足三诺在 AI 模型训练和推理方面的需求。GPU 资源将支持直接运行模型、使用 Docker 镜像部署大语言模型以及微调训练等多种使用场景。同时，Sealos 还将提供完善的 GPU 资源管理工具，帮助企业更好地管理和优化 GPU 资源的使用。
- **异地多中心架构**：针对数据库异地备份需求，Sealos 团队将邀请数据库专家与三诺团队一起进行配置。虽然配置过程较为复杂，但通过持续增量迁移功能可以实现异地多中心架构，从而提高数据容灾能力和系统高可用性。
- **拓展 AI 应用场景**：三诺的终极目标是实现 AI 医疗，计划将 AI 做成智能体，从当前的客服场景逐步拓展至：
  - 健康管理师角色：协助进行医疗监管工作
  - 医生助手角色：辅助医生诊断和治疗
  - 多渠道覆盖：包括医院、ToB 等不同场景
  - 智能慢病管理：利用 AI 提供智能化的慢病管理服务
- **规模化部署**：三诺计划在本月开启大规模试运行，重点关注：
  - 服务器稳定性保障
  - 高峰期资源调配
  - 用户规模扩展 (预计 APP 日活用户将增长三倍)
          `
        },
        {
          title: '总结',
          markdown: `
作为医疗行业数字化转型的标杆企业，三诺的智能客服经历了从大模型 “答非所问” 到日均处理 2\\~3 万次对话的跨越式发展，随着三诺 2 代 CGM 产品上市，未来预计日均处理 5\\~6 万次对话。

当看到客服人员从重复劳动中解放出来，转而处理更有价值的服务及慢病沟通时，我们更加确信：**好的技术方案不该让企业 “削足适履”，而要让业务 “如虎添翼”。**
          `
        }
      ],
      getStarted: '免费开始使用',
      backToAllCases: '返回所有案例'
    },
    'igettool': {
      title: '少年得到使用 Sealos 开启 AI 教育新范式',
      description: '了解少年得到如何运用 Sealos 简化 Kubernetes 开发环境，赋能非技术人员快速部署 AI 项目。',
      logo: '/images/customers/igettool.png',
      industry: '教育',
      companyName: '少年得到',
      quote: {
        text: "通过 Sealos，我们实现了 '即日答' 的开发理念。最快一天就能完成一个项目，最慢也就第二天、第三天就搞定了。在过去，这简直是不可想象的事情。",
        author: "张高",
        title: "少年得到技术负责人"
      },
      metrics: [
        { value: '50%', label: '开发效率提升' },
        { value: '60%', label: '资源成本降低' },
        { value: '1-3 天', label: '项目上线周期' }
      ],
      content: [
        {
          title: '关于少年得到',
          markdown: `
少年得到是一家专注于 5-15 岁青少年综合素质培养的在线教育品牌，致力于通过多元化的教育形式激发孩子的学习兴趣和思维能力，提供音视频课程、中文表达课程、阅读营以及研学旅行等服务。作为逻辑思维 (得到) 的子公司，少年得到在独立发展的过程中，积极探索 AI 工具技术创新，以提升业务效率和用户体验。

![](https://images.tryfastgpt.ai/forum/2025-03-20-17-00-qWeTfz.jpeg)

作为一家运营已有五六年历史的内容平台，少年得到的主要业务系统构建在阿里云上，拥有自己的 Kubernetes 集群。随着 AI 技术的崛起，公司内部开始大力推动 AI 的应用，也对技术基础设施提出了新的需求。
          `
        },
        {
          title: '面临挑战',
          markdown: `
在选择 Sealos 之前，少年得到的技术团队面临着几个关键挑战：

1. **环境配置复杂**：团队成员需要在 Kubernetes 集群上配置开发环境，这对非专业开发人员而言门槛较高。
2. **资源申请流程繁琐**：每次申请测试资源都需要运维团队严格审批，资源分配不够灵活。
3. **长周期的开发流程**：从编码到部署的整个流程通常需要一至两周时间，难以满足快速迭代的需求。
4. **资源使用不透明**：团队无法清晰了解资源使用情况及限制，容易导致资源浪费或突然耗尽。
5. **项目管理不便**：随着项目数量增加 (已有 55 个项目)，缺乏有效的筛选和管理功能，使得项目查找和管理变得困难。

这些挑战不仅影响了团队的日常开发效率，也阻碍了公司在 AI 创新领域的快速探索和实践。特别是在推动业务人员利用 AI 进行简单开发的战略下，传统的开发环境已无法满足需求。
          `
        },
        {
          title: '为什么选择 Sealos？',
          markdown: `
面对上述挑战，少年得到在评估多种方案后，最终选择了 Sealos。原因有以下几点：

### 容器化与 IDE 远程开发的无缝结合

![](https://images.tryfastgpt.ai/forum/2025-03-20-23-37-oxdjvh.png)

Sealos DevBox 的核心魅力在于将容器技术与 IDE 远程开发无缝结合。用户打开本地 IDE 就能在云端编写代码，不用在本地电脑上折腾环境安装。这种方式彻底解决了环境配置的复杂问题，让任何人都能快速投入开发工作。

### 弹性伸缩与资源高效利用

![](https://images.tryfastgpt.ai/forum/2025-03-20-23-40-k8RUBJ.png)

资源使用上，Sealos 提供了智能的弹性伸缩能力。系统会根据 CPU 和内存的实际使用率自动调整资源分配，可以从 1 个实例动态扩展到 5 个不等，资源不会闲置浪费，也不会在需要时捉襟见肘。

### DevBox 模板简化开发流程

![](https://images.tryfastgpt.ai/forum/2025-03-20-23-38-BDYipS.png)

Sealos Devbox 的模板功能很强大，用户可以把配置好的环境一键转成模板，之后创建新项目时直接套用，不用再重复配置。

### 与网关系统的集成

Sealos 内置的网关系统是另一个亮点，它支持公网访问和多种路由策略。少年得到团队可以更便捷地管理服务访问，不需要深陷复杂的网络配置中。

Sealos 的网关系统还支持与企业自建网关的集成，可以在现有网络基础上平滑过渡到 Sealos 平台。

网关系统还为团队省去了不少配置工作："现在网关支持 SSO 流出，省去了很多配置工作，连证书配置都不用做了。这点真的很赞。"

### Kubernetes API 兼容

![](https://images.tryfastgpt.ai/forum/2025-03-20-23-45-agD5vp.png)

遵循 Kubernetes 兼容性是 Sealos 的另一个优势。用户可以通过标准的 Kubernetes 命令行工具管理 DevBox 资源，比如用 \`kubectl get devbox\` 和 \`kubectl delete\` 来查看和删除资源。

Sealos 目前还在开发企业配额管理功能，让管理员能为团队成员分配固定额度，用完自动释放，从而实现更精细的资源管控。

### 开箱即用的中间件

![](https://images.tryfastgpt.ai/forum/2025-03-20-23-47-5KrK0a.png)

除了开发环境，少年得到还在 Sealos 平台上使用了数据库服务，作为项目的组成部分，用来存储应用数据。这些同样采用容器化部署的服务让管理和扩展变得更加简单。

虽然目前主要使用基础数据库服务，但 Sealos 平台提供的服务远不止于此，例如知识库使用 FastGPT 效果更好，尤其是对 PDF 的解析、OCR 和多模态处理做得很深入。

---

在云服务提供商的选择上，少年得到曾考虑过从阿里云迁移到腾讯云，但评估后发现迁移成本太高，可能会影响业务稳定性。尤其是主要业务已与阿里云的多种服务 (如 DataWorks 等数据分析工具) 深度绑定。因此，少年得到采取了更灵活的策略：保留主要业务在阿里云上运行，同时**将新业务和 AI 相关项目部署在 Sealos 平台上**，实现了平稳过渡和技术创新的双赢。
          `
        },
        {
          title: '落地实践',
          markdown: `
少年得到从2024年底开始在内部大力推动 Sealos 的应用，特别是在 AI 相关项目上。实施过程主要包括以下几个阶段：

1. **内部推广**：技术团队首先在内部推广 Sealos Devbox，鼓励开发人员尝试使用各种 IDE 工具来远程开发，如 VSCode、Cursor 等。

2. **项目迁移**：团队开始将新的 AI 相关项目部署到 Sealos 平台上，截至目前已有 55 个项目在平台上运行。

3. **流程优化**：结合 Sealos 的特性，团队简化了开发到部署的流程，缩短了项目周期。

4. **资源管理**：通过 Sealos 的资源管理功能，团队实现了更透明和高效的资源分配。

在实际使用中，少年得到团队采用了多种方式将代码导入到 Sealos DevBox 环境。最常用的做法是通过 DevBox 终端直接执行 Git 克隆命令，获取代码库。这种方式特别适合连接公司内网 Git 仓库或公开的 GitHub/GitLab 仓库的情况。

对于无法直接通过 Git 获取的代码，例如在公有云环境中无法访问内部 Git 仓库时，团队会选择通过拖拽方式将代码上传到 DevBox。这样就可以让各种技术背景的团队成员都能顺利导入代码。

另一个受欢迎的做法是利用 Sealos 的模板功能。团队为常用项目类型创建了预配置模板，使开发人员可以从模板快速创建新项目，大大简化了初始化过程。
          `
        },
        {
          title: '项目成果',
          markdown: `
通过实施 Sealos，少年得到在多个方面获得了显著改进：

### 成本节省 60%

与传统云服务相比，Sealos 帮助少年得到降低了约 50-60% 的资源成本。这种节省来自多个方面：

- 灵活的 CPU 和内存资源分配模式取代了固定规格收费；
- 网关系统让团队不再需要为每个服务单独配置公网资源；
- 简化的开发流程减少了对专业运维人员的依赖，优化了人力成本。

### 效率提升 50%

项目周期从传统的 1-2 周缩短到了 1-3 天，加速度接近 60%。环境配置时间从数小时级别减少到了分钟级，开发人员不再耗费大量时间在环境搭建上，而是能直接进入开发状态。资源申请流程也变得简单直接，开发人员可以自主创建和管理资源，不用经过繁琐的运维审批。

### 技术赋能

Sealos 的简单易用大大降低了技术门槛，让技术背景较弱的团队成员也能通过平台和 AI 工具完成简单的开发任务。团队成员不再局限于特定领域，更容易进行全栈开发。可以这么说，Sealos 为少年得到的 AI 创新项目提供了理想的基础设施，加速了 AI 技术在公司各个环节的应用。

### 实际业务应用场景

少年得到已经在多个业务场景中应用了 Sealos，包括 AI 驱动的内容生成、中文素养课程平台、阅读营数据分析，以及 "灵犀助手" 项目。

在音视频课程制作中，团队使用 AI 工具自动生成视频脚本和辅助内容，然后通过 Sealos 部署相关服务。为张泉灵老师的中文表达思想课，他们建立了交互式在线平台，方便学生学习和实践。阅读营业务则部署了数据分析工具，帮助团队更好地了解读者行为和偏好。而 "灵犀助手" 是少年得到在 Sealos 上运行的主要 AI 项目，旨在为用户提供智能化服务体验。
          `
        },
        {
          title: '未来展望',
          markdown: `
少年得到计划在未来进一步扩大在 Sealos 上的应用范围，尤其是在 AI 项目的开发和上线流程中。通过与 Sealos 的深度合作，少年得到将继续推动技术创新，提升业务效率，为青少年教育领域带来更多创新和突破。

- **AI 与自动化运维**：将更多的 AI 项目迁移到 Sealos 上，利用其强大的资源调度和自动化能力，进一步提升开发效率。
- **业务部门自主上线**：让业务部门能够自主完成代码编写和上线流程，技术团队将更多地专注于核心技术的研发和优化。

**Sealos 团队表示**：“我们很高兴看到少年得到通过 Sealos 实现了显著的效率提升和成本优化。未来，我们将继续优化产品，帮助更多企业像少年得到一样，通过技术驱动业务增长。特别是随着 AI 技术的普及，Sealos 的目标是让应用的生产周期大幅缩短，生产门槛大幅降低，从而实现应用的涌现，帮助企业获得最具性价比的应用，最大化降低企业软件生产成本”
          `
        },
        {
          title: '总结',
          markdown: `
通过 Sealos，少年得到不仅实现了资源成本的大幅节省，更重要的是彻底改变了团队的工作方式，让 AI 技术能更广泛地应用于公司各个环节。

如今 AI 技术日新月异，Sealos 为企业提供了一条高效、经济的上云之路，使非技术背景的团队成员也能参与到技术创新中来。正如张高所言："不用 AI 的、不会横向扩展的人员将被淘汰，以后每个人都要成为全栈型人才。" Sealos 正是这一趋势下的理想伙伴。
          `
        }
      ],
      getStarted: '免费开始使用',
      backToAllCases: '返回所有案例'
    },
    // Add more case studies as needed
  }
};

export async function generateMetadata({ params }: { params: { lang: languagesType, slug: string } }) {
  const caseStudy = caseStudies[params.lang]?.[params.slug];

  if (!caseStudy) {
    return {};
  }

  return generatePageMetadata({
    title: caseStudy.title,
    description: caseStudy.description,
    pathname: `${params.lang}/customers/${params.slug}`,
  });
}

function CaseStudyPageContent({
  params,
}: {
  params: { lang: languagesType; slug: string };
}) {
  const caseStudy = caseStudies[params.lang]?.[params.slug];

  if (!caseStudy) {
    notFound();
  }

  // Custom components for ReactMarkdown
  const MarkdownComponents = {
    img: (props: any) => (
      <div className="my-6">
        <img
          src={props.src}
          alt={props.alt}
          className="mx-auto rounded-lg shadow-md max-w-full"
        />
        {props.alt && (
          <p className="mt-2 text-center text-sm text-gray-500">{props.alt}</p>
        )}
      </div>
    ),
    table: (props: any) => (
      <div className="my-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" {...props} />
      </div>
    ),
    th: (props: any) => (
      <th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
    ),
    td: (props: any) => (
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-t border-gray-200" {...props} />
    ),
    tr: (props: any) => (
      <tr className="hover:bg-gray-50" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-primary/30 pl-4 italic text-gray-700 my-6" {...props} />
    ),
    a: (props: any) => (
      <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
    ),
    h2: (props: any) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />
    ),
    h3: (props: any) => (
      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />
    ),
    ul: (props: any) => (
      <ul className="list-disc pl-6 my-4 space-y-2" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />
    ),
    li: (props: any) => (
      <li className="text-gray-700" {...props} />
    ),
    p: (props: any) => (
      <p className="text-gray-700 leading-relaxed my-4" {...props} />
    ),
  };

  return (
    <main className="px-0 pt-0 pb-0 md:px-0 relative">
      {/* TOC Sidebar */}
      <TocSidebar />

      {/* Hero section with background image */}
      <div
        className="relative mb-12 overflow-hidden mt-16"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '380px'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>

        <div className="relative z-10 px-8 pt-10 pb-16 md:px-[15%] md:pt-14 md:pb-20">
          <Link
            href={`/customers`}
            className="mb-8 inline-flex items-center text-sm text-white/90 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {caseStudy.backToAllCases}
          </Link>

          <div className="mt-8 flex items-center">
            <div className="mr-4 h-12 bg-white/90 p-2 rounded">
              <img
                src={caseStudy.logo}
                alt={caseStudy.companyName}
                className="h-full"
              />
            </div>
            <div className="inline-block rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-wide text-white shadow-sm whitespace-nowrap">
              {caseStudy.industry}
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-white md:text-5xl lg:text-6xl max-w-4xl">
            {caseStudy.title}
          </h1>
        </div>
      </div>

      {/* Main content wrapper with optimized layout */}
      <div className="relative">
        {/* Unified content container with smart width management */}
        <div className="mx-auto max-w-5xl px-6 lg:px-8 xl:max-w-6xl xl:pr-72">

          {/* Mobile metrics scrolling cards */}
          <div className="mb-12 block sm:hidden">
            <div className="mb-4 text-center text-sm text-gray-500">Swipe left and right to view key metrics</div>
            <div className="overflow-x-auto pb-4">
              <div
                className="flex w-max space-x-4 px-4"
                style={{
                  background: 'linear-gradient(to right, white, #F8FBFF)',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)'
                }}
              >
                {caseStudy.metrics.map((metric: Metric, idx: number) => (
                  <div
                    key={idx}
                    className="relative flex h-32 w-40 shrink-0 flex-col items-center justify-center rounded-xl bg-white p-4 shadow-md"
                  >
                    {/* Decorative element */}
                    <div className="absolute -top-4 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-primary/10 blur-lg"></div>

                    <div
                      className="relative text-3xl font-bold"
                      style={{ color: '#0078D4' }}
                    >
                      {metric.value}
                    </div>
                    <div className="relative mt-2 text-xs font-medium text-gray-700">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop metrics grid */}
          <div
            className="mb-12 hidden grid-cols-1 gap-4 overflow-hidden rounded-xl p-0 shadow-lg sm:grid sm:grid-cols-3"
            style={{
              background: 'linear-gradient(to right, white, #F8FBFF)',
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)'
            }}
          >
            {caseStudy.metrics.map((metric: Metric, idx: number) => (
              <div
                key={idx}
                className={`relative p-6 text-center ${idx < caseStudy.metrics.length - 1 ? 'border-r' : ''} border-gray-100`}
              >
                {/* Decorative element */}
                <div className="absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-primary/10 blur-xl"></div>

                <div
                  className="relative text-4xl font-bold"
                  style={{ color: '#0078D4' }}
                >
                  {metric.value}
                </div>
                <div className="relative mt-2 text-sm font-medium text-gray-700">{metric.label}</div>
              </div>
            ))}
          </div>

          <blockquote
          className="mb-12 overflow-hidden rounded-xl p-6 text-center shadow-lg sm:p-8 md:p-10"
          style={{
            background: 'linear-gradient(135deg, rgba(82, 174, 255, 0.15), rgba(255, 248, 240, 0.4))',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 10px 20px -15px rgba(82, 174, 255, 0.2)'
          }}
        >
        {/* Decorative element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-yellow-500/5 blur-3xl"></div>

        <div className="relative">
          <p className="mb-4 text-base font-medium italic leading-relaxed text-gray-800 sm:mb-6 sm:text-xl md:text-2xl">
            <span className="text-2xl text-primary sm:text-3xl md:text-4xl">“</span>
            <span className="relative">
              <span className="relative z-10">{caseStudy.quote.text}</span>
              <span className="absolute bottom-0 left-0 z-0 h-2 w-full bg-primary/10 sm:h-3"></span>
            </span>
            <span className="text-2xl text-primary sm:text-3xl md:text-4xl">”</span>
          </p>
          <footer>
            <div className="text-base font-bold text-gray-900 sm:text-lg">{caseStudy.quote.author}</div>
            <div className="text-xs font-medium text-primary/80 sm:text-sm">{caseStudy.quote.title}</div>
          </footer>
          </div>
          </blockquote>

          {/* Main content area with optimized reading layout */}
          <div className="relative">
            {/* Content sections with better typography and spacing */}
            <div className="mb-12 space-y-10" id="case-study-content">
              {caseStudy.content.map((section: ContentSection, idx: number) => (
                <article
                  key={idx}
                  className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg lg:p-10"
                  style={{
                    background: idx % 2 === 0 ? 'linear-gradient(to right, white, #F8FBFF)' : 'linear-gradient(to left, white, #F8FBFF)'
                  }}
                >
                  <header className="mb-6">
                    <h2 className="inline-block text-2xl font-bold text-gray-900 lg:text-3xl">
                      <span className="relative">
                        {section.title}
                        <span className="absolute bottom-0 left-0 h-2 w-full bg-primary/10 lg:h-3"></span>
                      </span>
                    </h2>
                  </header>

                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-blockquote:border-primary/20 prose-blockquote:text-gray-600 prose-code:text-primary prose-pre:bg-gray-50">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                    >
                      {section.markdown}
                    </ReactMarkdown>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Call to Action section */}
          <div
            className="rounded-xl p-6 text-center shadow-xl sm:p-8 md:p-12"
            style={{
              background: 'linear-gradient(135deg, rgba(82, 174, 255, 0.2), rgba(255, 248, 240, 0.6), rgba(82, 174, 255, 0.15))',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 30px -15px rgba(82, 174, 255, 0.25)'
            }}
          >
            {/* Decorative element */}
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl"></div>

            <h2 className="relative mb-4 text-xl font-bold tracking-tight text-gray-900 sm:mb-6 sm:text-2xl md:text-3xl">
              <span className="relative inline-block">
                {caseStudy.title}
                <span className="absolute bottom-1 left-0 h-2 w-full bg-primary/20 sm:h-3"></span>
              </span>
            </h2>
            <div className="flex justify-center">
              <a href={appDomain} target="_blank" rel="noopener noreferrer">
                <div
                  className="relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-md bg-[#b2e3ff] px-6 py-2 text-[#005b9c] shadow-button hover:bg-[#97D9FF] sm:px-8 sm:py-3 sm:text-base"
                >
                  <div className="z-10">{caseStudy.getStarted}</div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="relative h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

        </div> {/* Close max-width container */}
      </div> {/* Close relative wrapper */}
    </main>
  );
}

// Export a wrapper component to handle translation errors
import CaseWrapper from '../components/case-wrapper';

export default function CaseStudyPage(props: { params: { lang: languagesType; slug: string } }) {
  return (
    <CaseWrapper lang={props.params.lang}>
      <CaseStudyPageContent params={props.params} />
    </CaseWrapper>
  );
}

// This is a placeholder for static params generation
// In a real implementation, you would generate these from your data source
export function generateStaticParams() {
  return [
    { slug: 'company-a-case-study' },
    // Add more slugs as needed
  ];
}