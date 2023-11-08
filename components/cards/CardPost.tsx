import Image from "next/image";
import Link from "next/link";

interface parms {
  id: "string";
  parentId: "string" | null;
  currentId: String | undefined;
  author: {
    id: "string";
    name: "string";
    image: "string";
  };
  content: "string";
  community: {
    id: "string";
    name: "string";
    image: "string";
  } | null;
  createdAt: "string";
  comments: {
    author: {
      image: "string";
    };
  }[];
  isComment?: boolean;
}

const CardPost = ({
  id,
  parentId,
  currentId,
  author,
  content,
  community,
  createdAt,
  comments,
  isComment,
}: parms) => {
  return (
    <article className={` flex w-full flex-col rounded-xl ${isComment?' px-0 xs:px-7': 'bg-dark-2 p-7'}`}>
      <div className=" flex items-start justify-between">
        <div className=" flex w-full flex-1 flex-row gap-4 ">
          <div className=" text-white flex flex-col items-center ">
            <Link
              href={"/profile/" + author.id}
              className="relative w-11 h-11">
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className=" text-white flex flex-col gap-4 w-full ">
            <Link
              href={"/profile/" + author.id}
              className=" cursor-pointer w-full">
              <h6>{author.name}</h6>
            </Link>
            <p className=" text-small-regular text-light-2 ">{content}</p>
            <div className={`${isComment && 'mb-10'} flex flex-col gap-3`}>
              <div className="mt-5 flex flex-row items-center gap-6">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  height={24}
                  width={24}
                  className=" hover:scale-125 cursor-pointer object-contain"
                />
                <Link href={`/post/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="heart"
                    height={24}
                    width={24}
                    className=" hover:scale-125 cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="heart"
                  height={24}
                  width={24}
                  className="hover:scale-125 cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="heart"
                  height={24}
                  width={24}
                  className="hover:scale-125 cursor-pointer object-contain"
                />
              </div>
              {!isComment && comments.length > 0 && (
                <Link href={`/post/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} repl{comments.length > 1 ? "ies" : "y"}</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CardPost;
