---
title: 'Sealos API 网关选型：为何最终选择 Higress (基于 Envoy) 支撑数千租户与海量路由'
imageTitle: 'Sealos：选择 Higress (Envoy) 实现大规模网关需求'
description: "揭秘 Sealos 为何放弃 Nginx Ingress，选择基于 Envoy 的 API 网关 Higress 来支撑数千租户及海量路由。了解 Nginx 的局限性及 Envoy 在多租户云环境中的卓越可扩展性。"
date: 2025-05-20
tags: ['Sealos', 'Envoy', 'Nginx', 'Higress', 'API网关', 'Kubernetes网关', '多租户']
authors: ['default']
---

Sealos 公有云几乎打爆了市面上所有主流的开源网关。本文旨在分享 Sealos 在为严苛的公有云环境进行 **API 网关选型**过程中的挑战、经验与教训，希望能为读者在**网关选型**上提供有价值的参考，避免常见的陷阱。

## Sealos Cloud 的复杂场景：对 API 网关的严苛考验

Sealos 云平台自上线以来，用户量可以说是爆发式增长，现在已经有超过 16 万注册用户了！你想想，每个用户都可能创建应用，每个应用都需要自己独立的访问入口，这就导致整个集群的路由条目变得异常庞大，我们必须具备**支撑数十万条 [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) 的路由能力**。这对于 **Kubernetes 网关选型**来说，规模是首要考虑因素。

而且，咱们是在公网上提供共享集群服务，这对[多租户隔离](https://www.redhat.com/en/topics/cloud-computing/what-is-multitenancy)的要求高到离谱。用户之间的流量必须做到完全隔离，路由不能互相干扰，还得有精细的流量控制能力，以防止跨租户干扰。

公有云环境嘛，安全挑战也是巨大的。黑客们不仅会盯着用户部署的应用，平台的出口网络也是他们的目标。这对我们云运营商来说，意味着复杂的攻击向量。因此，一个既安全又**可扩展的 API 网关**简直就是生命线。

还有就是控制器组件的性能。路由表一大，很多方案的控制器就特别吃资源，甚至会因为内存不足（OOM）直接把网关搞垮——这对于任何**生产级的 Kubernetes Ingress 解决方案**来说，都是致命的。

## 初期挑战：Nginx Ingress 因局限性被排除

我们最初采用的是 Nginx Ingress，但很快暴露出几个核心问题，严重影响了我们服务多租户公有云的能力：

*   **Reload 不稳定性**：配置变更会导致连接短暂中断。在多用户集群中，频繁的 Ingress 修改导致网络持续不稳定。
*   **长连接不可靠**：同样是因为配置更新，正在使用的长链接也经常莫名其妙就断了，对那些需要实时通信的应用来说，这简直是灾难。
*   **性能瓶颈**：我们观察到，在负载较高时，[Nginx Ingress](https://github.com/kubernetes/ingress-nginx) 的配置生效慢，而且资源消耗也大，实在不适合作为我们需要的那种**高性能 API 网关**。

这些 **Nginx Ingress 的核心局限性**，让我们不得不将目光投向其他基于非 Nginx 的网关。而在我们的实测中，基于 [Envoy](https://www.envoyproxy.io/) 实现的网关在性能上简直是“碾压级”的存在，无论控制面还是数据面，资源消耗都极低。

![Envoy 实例的 CPU 和内存占用](./images/sealos-envoy-api-gateway-instances-cpu-memory.png)

![Nginx 实例的 CPU 和内存占用](./images/sealos-nginx-ingress-api-gateway-instances-cpu-memory.png)

性能上的显著差异，坚定了我们**彻底转向基于 Envoy 的解决方案**的决心。

## APISIX：优秀的内核与“拖后腿”的 Ingress Controller

[APISIX](https://apisix.apache.org/) 本身是个非常棒的项目，它很有效地解决了 Nginx reload 的一些老大难问题。所以，我们早期的 Laf 平台也尝试了 APISIX。但让人头疼的是，它的 **APISIX Ingress Controller** 在实际使用中稳定性欠佳。控制面几次崩溃给我们造成了不小的故障，甚至还出现过控制器 OOM 的问题。

说实话，我们当时真的很想把它用好，但接二连三的故障最终还是让我们“被迫劝退”。当然，APISIX 社区一直在积极跟进和解决这些问题，我们也希望它能越做越好。

**总结一下 APISIX 的情况：** 内核（APISIX 本身）稳定性出色，但其 **APISIX Ingress Controller** 在稳定性与资源优化方面仍有较大提升空间。尽管社区响应积极，但对于我们线上环境“火烧眉毛”的紧急需求，我们实在无法等待其逐步迭代完善，**最终只能忍痛割爱，切换到其他网关方案。**

## Cilium Gateway：理念契合，但现实存在差距

我们早早地将 CNI 切换到了 [Cilium](https://cilium.io/)（确实很强），自然也考虑过网关层面也统一采用 **Cilium Gateway**。然而，现实却给我们泼了盆冷水。

Cilium Gateway 目前只支持 LB（负载均衡）模式，这就意味着它会**强依赖云厂商的 LB 服务**。这对我们来说不太友好，因为我们还有不少私有化部署的场景，更倾向于解耦的架构。稳定性方面，我们也遇到了麻烦：当路由规则数量非常庞大时，**Cilium Gateway 的 Ingress 规则生效速度慢到令人难以接受（需要分钟级）**。而我们的 SLA 要求路由变更在 5 秒内收敛。这样的用户体验显然是不合格的。因此，**我们目前的结论是：在这些关键问题得到解决前，暂缓采用 Cilium Gateway。**

## Envoy Gateway：早期评估遇到的问题，现已修复

从 Kubernetes 标准演进的角度看，未来趋势是从传统的 Ingress 迁移到标准的 Gateway API。再考虑到我们对 Envoy 内核的偏爱，**[Envoy Gateway](https://gateway.envoyproxy.io/)** 最初看起来是个非常有前景的选择。所以，我们对它进行了调研。

然而，在我们**早期评估时**（基于去年的版本），这个项目还处于相对早期的阶段，当时遇到了一些不稳定的 Bug，比如内存泄漏导致的 OOM、pathpolicy 不生效，以及某些特性在 merge gateway 模式下无法工作等问题。值得欣慰的是，**这些问题现在都已经得到了修复**，Envoy Gateway 社区的响应速度和修复能力都非常出色。我们也通过提交 Bug 报告和改进建议积极参与了上游社区贡献。不过，由于我们当时面临的生产需求比较紧急，**在当时的时间节点上，我们选择了其他更成熟的方案。**

## Kubernetes Gateway API 标准：理念优雅，多租户实践存疑

聊到 [Kubernetes 的 Gateway API 标准](https://gateway-api.sigs.k8s.io/)，我的感觉是有点“理想很丰满，现实很骨感”，尤其是在复杂的多租户场景下。设计者似乎并未完全深入实践过**大规模多租户 Kubernetes 网关**的真实需求。

当多个租户共享一个集群时，明确管理员和普通用户之间的**权限边界**至关重要。但现有的 Gateway API 设计在这一点上考虑得不够周全。举个例子：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: eg
spec:
  gatewayClassName: eg
  listeners:
  - name: http
    port: 80
    protocol: HTTP
    # hostname: "*.example.com"
  - name: https
    port: 443
    protocol: HTTPS
    # hostname: "*.example.com"
    tls:
      mode: Terminate
      certificateRefs:
      - kind: Secret
        name: example-com
```

像监听端口这类配置，理应由集群管理员掌控，而不是普通用户。而 TLS 证书配置则与具体应用绑定，虽然管理员可以配置，但主要还是应该由各个用户管理自己的证书。这就导致了权限的混淆。如果允许用户配置 Gateway 资源，那控制器层面就必须实现大量复杂的权限控制逻辑，比如端口号白名单、冲突检测等等。

个人觉得，一个更优雅的设计，私以为应该将租户特有的配置（如证书）下沉到 HTTPRoute 层面，或者通过专属的 CRD (Custom Resource Definitions) 来实现。这样能更清晰地划分用户空间操作和超级管理员的权限边界。当然，现有方式也能用，只是略显混杂——好在还能跑起来。

## Higress：解决核心痛点，Sealos 的最终选择

除了上面重点提到的几个项目，我们其实还测试了不少其他的网关方案，这里就不一一列举了。经过广泛的评估和真实场景的“千锤百炼”，我们的焦点逐渐集中在那些能够真正克服先前网关痛点的解决方案上。最终，**Sealos 选择了基于 Envoy 的 [Higress 网关](https://higress.cn/)**。

我们选择网关的逻辑其实很简单：在满足功能的前提下，**稳定性压倒一切**。可以说，Higress 几乎是我们用排除法筛选出来的，在我们严苛的场景下，目前能达到生产可用的只有它。

当然，实践过程中 Higress 也并非一帆风顺，也遇到过一些小插曲。但好在 Higress 社区给力，响应非常迅速，帮我们很快解决了问题。主要有这么几个：

1.  **海量 Ingress 配置的极致效率**：最初，当路由条目非常多时，新建一条 Ingress 规则需要超过 2 分钟才能生效。这对于我们动态变化的环境是不可接受的。经过 Higress 社区的专项优化及其独特的**增量配置加载机制**，将这一时间缩短到了**3 秒左右**！这个性能水平已经达到了极致，甚至比容器的 Ready 时间还要短，对我们来非常重要。
2.  **控制器的高稳定与低消耗**：之前在某些非动态加载场景下，其他网关的控制器曾因资源消耗过大而出现 OOM。Higress 的控制器实现在海量路由负载下依然**稳定如初，且资源消耗极低**，彻底解决了我们的“三高”焦虑。
3.  **超时问题的妥善处理**：我们曾在一个主集群中，为了进一步优化加载延迟而开启了 `onDemandRDS` 参数，结果偶尔会遇到请求超时。目前我们暂时关闭了这个配置，问题得到了缓解，Higress 社区也在协助我们进一步排查根本原因。在其他集群中则没有发现类似问题。

在安全性方面，我们过去的很多故障其实都源于性能瓶颈。流量一大，网关被打爆是常有的事。所以，**API 网关性能**就显得格外重要。实测下来，Envoy 的性能确实强悍得多，而控制器的实现好坏也直接关系到生死存亡。在这方面，Higress 的表现非常出色：

![Higress 控制器在海量路由负载下的性能表现](./images/sealos-higress-api-gateway-controller-performance-routing-loads.png)

![Higress 在超高并发场景下的资源消耗](./images/sealos-higress-api-gateway-resource-consumption-high-concurrency.png)

即使在海量路由和超高并发的极端情况下，Higress 所需的资源也少得惊人。

还有一个对我们来说至关重要的点：**Higress 兼容 Nginx Ingress 的语法**，主要是通过支持相关的 annotations。我们现有的代码库大量使用了 Ingress，这意味着**几乎零迁移成本**，几分钟就能搞定升级，这个无缝的过渡路径对我们来说是个巨大的加分项。

为了促进 Higress 社区的更好发展，我们也基于实际使用体验，给 Higress 提了一些小建议：

*   **持续强化对 Gateway API 标准的支持**：虽然 Higress 目前已经支持了 Gateway API v1 版本，但在功能上与我们之前在 Ingress 上依赖的一些能力相比，还有一些可以完善和增强的空间，我们期待 Higress 在这方面能持续发力，提供更全面的特性。
*   **将更多“大杀器”功能开源**：像高级安全防护、智能熔断这类对我们来说非常关键的功能，如果能开源出来，无疑会大大提升 Higress 的吸引力。当然，随着我们平台能力的演进，对一些商业化的增强功能，我们也是持开放和欢迎态度的。
*   **扩展插件生态，保持核心精简**：我们建议将更多的周边功能通过健壮的插件机制来扩展，这样可以让 Higress 的核心功能更加内聚、简单和可靠，也方便社区开发者贡献和定制。

## 总结：战略性的网关选择助力云平台成功

API 网关对于云基础设施和上层应用来说是一个**极其核心的关键组件**。随着 Sealos 规模的不断扩大，未来在 **API 网关管理**方面肯定还会遇到新的挑战。我们希望能和上下游的开源社区建立更紧密的合作关系，共同推动开源网关技术的发展，让更多的开发者从中受益。

上面我们提到的 Nginx Ingress、APISIX、Cilium Gateway 和 Envoy Gateway，它们本身都是非常优秀的开源项目。Sealos 最终没有选择它们，并不代表这些项目本身有什么不足，更多的是因为我们所面临的**场景实在太苛刻、太独特**了——需要一个能在大规模公网环境下稳定支撑**高性能、高可扩展性、强多租户隔离的 API 网关**。

说实话，放眼整个开源社区，真正能满足我们这种规模和复杂度需求的网关并不多。所以，各位在做技术选型时，一定要从自身的实际场景出发。我们这次的**API 网关选型之旅**，希望能给大家提供一个有价值的参考。同时，**[Sealos 云平台](https://cloud.sealos.run)** 自身也会以开放的心态，持续关注和学习其他优秀网关技术的发展。