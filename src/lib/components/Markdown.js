import gfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import mentions from "./remark/mentions";
import hashtags from "./remark/hashtags";

export const Markdown = (props) => {
  const { onLinkClick, text, onMention, onHashtag, syntaxHighlighterProps } =
    props;
  return (
    <ReactMarkdown
      plugins={[]}
      rehypePlugins={[]}
      remarkPlugins={[gfm, mentions, hashtags]}
      children={text}
      components={{
        strong({ node, children, ...props }) {
          if (onMention && node.properties?.accountId) {
            return onMention(node.properties?.accountId);
          } else if (onHashtag && node.properties?.hashtag) {
            return onHashtag(node.properties?.hashtag);
          }
          return <strong {...props}>{children}</strong>;
        },
        a: ({ node, ...props }) =>
          onLinkClick ? (
            <a onClick={onLinkClick} {...props} />
          ) : props.href && props.href.includes("spotify") ? (
            <>
              <iframe
                style={{ borderRadius: "12px" }}
                src={props.href.replace(
                  "open.spotify.com/",
                  "open.spotify.com/embed/"
                )}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </>
          ) : props.href && props.href.includes("youtu.be") ? (
            (() => {
              const videoId = props.href.split("/").pop();
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  width="640"
                  height="360"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                />
              );
            })()
          ) : props.href && props.href.includes("youtube") ? (
            // Extract the video ID from the YouTube URL
            (() => {
              const videoId = props.href.match(/v=([\w-]{11})/)?.[1];
              // Use the video ID in the iframe src
              return (
                <iframe
                  id="ytplayer"
                  type="text/html"
                  width="640"
                  height="360"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                />
              );
            })()
          ) : (
            <a target="_blank" {...props} />
          ),
        img: ({ node, ...props }) => <img className="img-fluid" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="blockquote" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table className="table table-striped" {...props} />
        ),
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const { wrapLines, lineProps, showLineNumbers, lineNumberStyle } =
            syntaxHighlighterProps ?? {};

          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              {...{ wrapLines, lineProps, showLineNumbers, lineNumberStyle }}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};
