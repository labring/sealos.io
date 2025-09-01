---
title: What is a Custom Resource Definition (CRD) in Kubernetes?
imageTitle: What is a Kubernetes CRD?
description: Describes how CRDs extend the Kubernetes API, allowing users to create their own custom resource types and build declarative APIs for their applications.
date: 2025-08-29
tags: [Kubernetes, CRD, Custom Resource, API, Operator, Controller, Automation]
authors: ['default']
---

Kubernetes is incredibly powerful because it provides a rich set of building blocks for running applications. We have `Pods`, `Deployments`, `Services`, `Secrets`, and more. Think of these as the standard vocabulary that Kubernetes understands right out of the box.

But what happens when this standard vocabulary isn't enough? What if you want to manage a concept that is unique to your application, like a `DatabaseBackup`, a `MlTrainingJob`, or a `WebsiteCertificate`, and treat it as a first-class citizen in your cluster? Shoving complex configuration into a generic `ConfigMap` feels messy and unintuitive. You want to speak your application's language.

This is exactly why Kubernetes provides **Custom Resource Definitions (CRDs)**. A CRD is a powerful feature that allows you to teach Kubernetes new words, extending its API to understand and manage concepts that are specific to your domain.

In this guide, we'll explain what a CRD is, how it lets you create your own Kubernetes objects, and how it serves as the foundation for the powerful Operator pattern.

## The Standard Kubernetes Vocabulary

Let's start with what Kubernetes already knows. It's like a chef who has a set of well-known, standardized recipes. These are the built-in resources:

- **Deployment:** A recipe for running a stateless application.
- **StatefulSet:** A recipe for running a stateful application with a stable identity.
- **Service:** A recipe for creating a stable network endpoint for your Pods.
- **ConfigMap:** A recipe for storing non-sensitive configuration data.

These resources are the generic, all-purpose tools that can build almost anything. However, a `Deployment` object doesn't understand what a "WordPress installation" is; it only understands how to manage a set of identical Pods. You, the human, have to maintain the mental model that connects a specific `Deployment`, `Service`, and `PersistentVolumeClaim` together to form "WordPress."

**The Analogy:** Imagine you're a building manager using a software system. The system understands `Apartments`, `Tenants`, and `LeaseAgreements`. If the tenants want to start a weekly book club, how do you manage that in the system? You could put a note in a `LeaseAgreement`'s description field, but that's a hack. The system doesn't _natively_ understand what a `BookClub` is, so it can't manage it intelligently.

## What is a Custom Resource Definition (CRD)?

A **Custom Resource Definition (CRD)** is a way to create a brand-new resource type in your Kubernetes cluster. It's the mechanism for extending the Kubernetes API with your own objects.

When you create a CRD, you are effectively telling your Kubernetes cluster's API server:

> "Hey, from now on, I want you to recognize a new object `kind` called `BookClub`. It should have a `spec` that includes fields like `meetingDay`, `genre`, and `memberCount`."

Creating a CRD is like adding a new, custom recipe card to the chef's cookbook. The chef now has a formal, structured way to understand and prepare a new dish. In our building manager analogy, it's like adding a new module to the software that natively understands and manages `BookClub` objects.

Once a CRD is applied to a cluster, the Kubernetes API server dynamically creates a new RESTful API endpoint for that resource type. You can now interact with your new object using `kubectl`, just like you would with a built-in resource.

## CRD vs. CR: Definition vs. Instance

It's important to distinguish between two related terms:

1.  **Custom Resource Definition (CRD):** This is the **schema** or the template. You define the _structure_ of your new object: its name, its fields, and their types (e.g., string, integer). You typically create a CRD only once per object type.
2.  **Custom Resource (CR):** This is an **instance** of your CRD. It's a specific object you create that conforms to the schema defined in the CRD. You can create as many CRs as you want.

So, first you create the `BookClub` CRD. Then, your tenants can create multiple CRs:

```yaml
# A Custom Resource for the fantasy book club
apiVersion: 'building.example.com/v1'
kind: BookClub
metadata:
  name: fantasy-readers-unite
spec:
  meetingDay: 'Wednesday'
  genre: 'Fantasy'
  memberCount: 12
---
# A Custom Resource for the history book club
apiVersion: 'building.example.com/v1'
kind: BookClub
metadata:
  name: history-buffs-circle
spec:
  meetingDay: 'Thursday'
  genre: 'History'
  memberCount: 8
```

Now, you can manage these objects with familiar commands: `kubectl get bookclubs`.

## The Real Power: Connecting CRDs to Controllers

So, you've taught Kubernetes a new word. Now what? By itself, a CRD only gives you a way to store and retrieve structured data in the Kubernetes API. This isn't very useful on its own.

The true power of CRDs is unleashed when you pair them with a **custom controller**. This is the heart of the **Operator Pattern**.

A custom controller is the active, logical component. It's a program that runs in your cluster and "watches" your custom resources. When you create, update, or delete a CR, the controller notices and takes action. This is the reconciliation loop.

- **The CRD** is the declarative "what." It's the user's intent: "I want a fantasy book club that meets on Wednesdays."
- **The Controller** is the imperative "how." It contains the operational logic to make that intent a reality: "Okay, a new `BookClub` object was created. I will now book the community room every Wednesday, send an email to the members, and update the building's event calendar."

This combination allows you to create powerful, declarative APIs for your own applications, automating complex tasks that would otherwise require manual intervention.

## Leveraging the Power of CRDs with the Sealos App Store

While CRDs are the key to unlocking true cloud-native automation, building the custom controllers that bring them to life is a serious software engineering effort. How can you get the benefits of this powerful pattern without having to build it all yourself?

The **Sealos platform and its App Store** are built upon the most robust and mature CRDs and Operators in the Kubernetes ecosystem.

- When you deploy a database cluster, Sealos uses a high-level CRD like `PostgresCluster` to declaratively manage it.
- When you set up monitoring, Sealos leverages the `Prometheus` and `ServiceMonitor` CRDs to automate configuration.

Sealos provides a simple, graphical interface that allows you to create and manage these powerful Custom Resources without ever writing YAML or understanding the complex controller logic behind them. It effectively democratizes access to the most advanced automation patterns Kubernetes has to offer.

## Conclusion

Custom Resource Definitions are a fundamental feature for extending Kubernetes beyond its initial design. They allow you to transform the Kubernetes API into one that understands the specific language of your applications. While a **CRD** defines the schema for a new object, it's the combination with a **custom controller** that unlocks true automation, forming the basis of the Operator pattern. This enables a declarative, self-managing system for even the most complex software.

Ready to harness the declarative power of Kubernetes for your own applications without the development overhead? **Explore the Sealos App Store and see how custom resources simplify complex application management.**
